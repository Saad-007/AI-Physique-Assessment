import { supabase } from "../lib/supabase";

export const updateDailyStreak = async (userId) => {
  try {
    // 1. Fetch current user data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; 
    
    let newStreak = profile.current_streak || 0;
    let newLongest = profile.longest_streak || 0;

    if (profile.last_active_date) {
      const lastActiveDate = new Date(profile.last_active_date);
      const diffTime = Math.abs(today - lastActiveDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (profile.last_active_date === todayString) {
        return { streak: newStreak, updated: false };
      } else if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    if (newStreak > newLongest) {
      newLongest = newStreak;
    }

    // 2. Save back to Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active_date: todayString
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { streak: newStreak, updated: true };

  } catch (error) {
    console.error("Failed to update streak:", error);
    return null;
  }
};