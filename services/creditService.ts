import { supabase } from './supabaseService';

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'usage' | 'purchase' | 'bonus' | 'reset';
  amount: number;
  credit_type: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface CreditSummary {
  current_credits: number;
  monthly_limit: number;
  total_used_this_month: number;
  remaining_this_month: number;
  last_reset: string | null;
}

export const creditService = {
  // Get current credit summary
  async getCreditSummary(): Promise<CreditSummary | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('credit_summary')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) {
        // Fallback: get from users table
        const { data: user } = await supabase
          .from('users')
          .select('credits, last_credit_reset')
          .eq('id', session.user.id)
          .single();

        if (user) {
          return {
            current_credits: user.credits || 0,
            monthly_limit: 5, // Default for FREE plan
            total_used_this_month: 0,
            remaining_this_month: 5,
            last_reset: user.last_credit_reset
          };
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting credit summary:', error);
      return null;
    }
  },

  // Get credit transactions history
  async getTransactionHistory(limit: number = 20): Promise<CreditTransaction[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  },

  // Get monthly usage by type
  async getMonthlyUsage(): Promise<{ credit_type: string; total_used: number }[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      // Call the database function
      const { data, error } = await supabase
        .rpc('get_monthly_credit_usage', { user_uuid: session.user.id });

      if (error) {
        console.warn('RPC function not available, using fallback');
        // Fallback: calculate manually
        const transactions = await this.getTransactionHistory(100);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const usageByType: Record<string, number> = {};
        transactions
          .filter(t => t.type === 'usage' && new Date(t.created_at) >= startOfMonth)
          .forEach(t => {
            usageByType[t.credit_type] = (usageByType[t.credit_type] || 0) + Math.abs(t.amount);
          });

        return Object.entries(usageByType).map(([credit_type, total_used]) => ({
          credit_type,
          total_used
        }));
      }

      return data || [];
    } catch (error) {
      console.error('Error getting monthly usage:', error);
      return [];
    }
  },

  // Check if user can use credits
  async canUseCredit(creditType: string, amount: number = 1): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data, error } = await supabase
        .rpc('can_use_credit', {
          user_uuid: session.user.id,
          p_credit_type: creditType,
          amount_needed: amount
        });

      if (error) {
        // Fallback: manual check
        const summary = await this.getCreditSummary();
        if (!summary) return false;
        return summary.current_credits >= amount;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking credit usage:', error);
      return false;
    }
  },

  // Deduct credits when used
  async deductCredit(
    creditType: string,
    amount: number = 1,
    description?: string,
    referenceId?: string
  ): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data, error } = await supabase
        .rpc('deduct_credit', {
          user_uuid: session.user.id,
          p_credit_type: creditType,
          amount: amount,
          description: description || null,
          reference_id: referenceId || null
        });

      if (error) {
        console.warn('RPC not available, doing manual deduction');
        // Fallback: manual deduction
        const canUse = await this.canUseCredit(creditType, amount);
        if (!canUse) return false;

        // Get current credits first
        const { data: currentUser } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (currentUser) {
          await supabase
            .from('users')
            .update({ credits: currentUser.credits - amount })
            .eq('id', session.user.id);

          // Record transaction
          await supabase.from('credit_transactions').insert({
            user_id: session.user.id,
            type: 'usage',
            amount: -amount,
            credit_type: creditType,
            description: description || null,
            reference_id: referenceId || null
          });
        }

        return true;
      }

      return data || false;
    } catch (error) {
      console.error('Error deducting credit:', error);
      return false;
    }
  },

  // Add credits (for purchases, bonuses, manual adjustments)
  async addCredits(
    creditType: string,
    amount: number,
    transactionType: 'purchase' | 'bonus' | 'reset',
    description?: string
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .rpc('add_credits', {
          user_uuid: session.user.id,
          p_credit_type: creditType,
          amount: amount,
          transaction_type: transactionType,
          description: description || null
        });

      if (error) {
        console.warn('RPC not available, doing manual addition');
        // Fallback: manual addition
        // Get current credits first
        const { data: currentUser } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (currentUser) {
          await supabase
            .from('users')
            .update({ credits: currentUser.credits + amount })
            .eq('id', session.user.id);

          await supabase.from('credit_transactions').insert({
            user_id: session.user.id,
            type: transactionType,
            amount: amount,
            credit_type: creditType,
            description: description || null
          });
        }
      }
    } catch (error) {
      console.error('Error adding credits:', error);
    }
  },

  // Get credit type display name
  getCreditTypeName(type: string): string {
    const names: Record<string, string> = {
      'draft': 'Borradores',
      'final_image': 'Imágenes Finales',
      'video': 'Videos',
      'product_upload': 'Subir Productos',
      'all': 'Todos'
    };
    return names[type] || type;
  },

  // Get transaction type icon
  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      'usage': '📉',
      'purchase': '💳',
      'bonus': '🎁',
      'reset': '🔄'
    };
    return icons[type] || '📊';
  }
};

export default creditService;