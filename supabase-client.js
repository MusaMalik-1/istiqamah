const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://roeljqvfkycwqtneqncy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sVJRx2WKyQ4edy0F4WRQNw_BQCJGOlI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

function generateFriendCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'IST-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Creates or retrieves a profile in Supabase
 */
async function registerOrGetProfile(existingProfile, displayName) {
  try {
    if (existingProfile && existingProfile.id && existingProfile.friendCode) {
      // Update display name if changed
      if (displayName && displayName.trim() && displayName !== existingProfile.displayName) {
        await supabase
          .from('profiles')
          .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
          .eq('id', existingProfile.id);
        existingProfile.displayName = displayName.trim();
      }
      return { success: true, profile: existingProfile };
    }

    // Generate unique friend code
    let code = generateFriendCode();
    let name = displayName && displayName.trim() ? displayName.trim() : 'Friend';

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ friend_code: code, display_name: name }])
      .select()
      .single();

    if (error) {
      // If code collided, try once more
      code = generateFriendCode();
      const retry = await supabase
        .from('profiles')
        .insert([{ friend_code: code, display_name: name }])
        .select()
        .single();

      if (retry.error) {
        return { success: false, error: retry.error.message };
      }
      return {
        success: true,
        profile: {
          id: retry.data.id,
          friendCode: retry.data.friend_code,
          displayName: retry.data.display_name
        }
      };
    }

    return {
      success: true,
      profile: {
        id: data.id,
        friendCode: data.friend_code,
        displayName: data.display_name
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sync daily progress for the current user
 */
async function syncDailyProgress(profileId, stats, dateKey) {
  if (!profileId) return { success: false, error: 'No profile ID' };

  try {
    const payload = {
      profile_id: profileId,
      date_key: dateKey,
      percentage: stats.percentage || 0,
      total_tasks: stats.totalTasks || 29,
      completed_tasks: stats.totalCompleted || 0,
      prayers_completed: stats.prayersCompleted || 0,
      water_glasses: stats.waterGlasses || 0,
      current_streak: stats.currentStreak || 0,
      quiz_score: stats.quizScore || 0,
      updated_at: new Date().toISOString()
    };

    let { error } = await supabase
      .from('daily_progress')
      .upsert(payload, { onConflict: 'profile_id,date_key' });

    if (error && error.message && error.message.toLowerCase().includes('quiz_score')) {
      // Graceful fallback if user hasn't added quiz_score column yet
      delete payload.quiz_score;
      const retry = await supabase
        .from('daily_progress')
        .upsert(payload, { onConflict: 'profile_id,date_key' });
      if (retry.error) {
        return { success: false, error: retry.error.message };
      }
      return { success: true };
    }

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Look up a friend by their Friend Code
 */
async function lookupFriendByCode(myProfileId, friendCode) {
  if (!friendCode) return { success: false, error: 'Enter a friend code' };
  const cleanCode = friendCode.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, friend_code, display_name')
      .eq('friend_code', cleanCode)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: `No user found with code "${cleanCode}". Please double check with your friend.` };
    }
    if (data.id === myProfileId) {
      return { success: false, error: 'That is your own friend code.' };
    }

    return {
      success: true,
      friend: {
        id: data.id,
        friendCode: data.friend_code,
        displayName: data.display_name
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch progress for a list of friend IDs for a specific date
 */
async function fetchFriendsProgress(friendIds, dateKey) {
  if (!Array.isArray(friendIds) || friendIds.length === 0) {
    return { success: true, friends: [] };
  }

  try {
    // 1. Get friend profiles
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('id, friend_code, display_name')
      .in('id', friendIds);

    if (pErr) return { success: false, error: pErr.message };

    // 2. Get their progress for today
    const { data: progressList, error: progErr } = await supabase
      .from('daily_progress')
      .select('*')
      .in('profile_id', friendIds)
      .eq('date_key', dateKey);

    if (progErr) return { success: false, error: progErr.message };

    const progressMap = {};
    (progressList || []).forEach(p => {
      progressMap[p.profile_id] = p;
    });

    const result = (profiles || []).map(prof => {
      const prog = progressMap[prof.id] || {
        percentage: 0,
        completed_tasks: 0,
        total_tasks: 29,
        prayers_completed: 0,
        water_glasses: 0,
        current_streak: 0,
        quiz_score: 0
      };
      return {
        id: prof.id,
        friendCode: prof.friend_code,
        displayName: prof.display_name,
        percentage: prog.percentage,
        completedTasks: prog.completed_tasks,
        totalTasks: prog.total_tasks,
        prayersCompleted: prog.prayers_completed,
        waterGlasses: prog.water_glasses,
        currentStreak: prog.current_streak,
        quizScore: prog.quiz_score || 0,
        updatedAt: prog.updated_at
      };
    });

    // Sort by completion percentage descending, then current streak descending
    result.sort((a, b) => b.percentage - a.percentage || b.currentStreak - a.currentStreak);

    return { success: true, friends: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  registerOrGetProfile,
  syncDailyProgress,
  lookupFriendByCode,
  fetchFriendsProgress
};
