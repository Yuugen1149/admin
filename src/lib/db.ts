import { supabase } from './supabase';

export interface FileRecord {
    id: number;
    filename: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    file_path: string;
    uploaded_at: string;
    folder_id?: number | null;
}

export const db = {
    files: {
        findAll: async (): Promise<FileRecord[]> => {
            const { data, error } = await supabase.from('files').select('*');
            if (error) {
                console.error('Error fetching files:', error);
                return [];
            }
            return data || [];
        },
        create: async (fileData: Omit<FileRecord, 'id' | 'uploaded_at'>): Promise<FileRecord> => {
            const { data, error } = await supabase
                .from('files')
                .insert([fileData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (id: number): Promise<void> => {
            const { error } = await supabase
                .from('files')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        update: async (id: number, updates: Partial<FileRecord>): Promise<FileRecord> => {
            const { data, error } = await supabase
                .from('files')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },
    events: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase.from('events').select('*');
            if (error) {
                console.error('Error fetching events:', error);
                return [];
            }
            return data || [];
        },
        create: async (eventData: any): Promise<any> => {
            const { data, error } = await supabase
                .from('events')
                .insert([eventData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (id: number): Promise<void> => {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    members: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase.from('members').select('*');
            if (error) {
                console.error('Error fetching members:', error);
                return [];
            }
            return data || [];
        },
        create: async (memberData: any): Promise<any> => {
            const { data, error } = await supabase
                .from('members')
                .insert([memberData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        updateStatus: async (id: number, status: string): Promise<void> => {
            const { error } = await supabase
                .from('members')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        }
    },
    messages: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('timestamp', { ascending: true });
            if (error) {
                console.error('Error fetching messages:', error);
                return [];
            }
            return data || [];
        },
        create: async (msg: any): Promise<any> => {
            const { data, error } = await supabase
                .from('messages')
                .insert([msg])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },
    users: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase.from('users').select('*');
            if (error) {
                console.error('Error fetching users:', error);
                return [];
            }
            return data || [];
        },
        create: async (userData: any): Promise<any> => {
            const { data, error } = await supabase
                .from('users')
                .insert([userData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        updateLastSeen: async (email: string): Promise<void> => {
            const { error } = await supabase
                .from('users')
                .update({ last_seen: new Date().toISOString() })
                .eq('email', email);
            if (error) console.error('Error updating last seen:', error);
        }
    },
    announcements: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching announcements:', error);
                return [];
            }
            return data || [];
        },
        create: async (announcementData: any): Promise<any> => {
            const { data, error } = await supabase
                .from('announcements')
                .insert([announcementData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (id: number): Promise<void> => {
            const { error } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    folders: {
        findAll: async (): Promise<any[]> => {
            const { data, error } = await supabase.from('folders').select('*');
            if (error) {
                console.error('Error fetching folders:', error);
                return [];
            }
            return data || [];
        },
        findById: async (id: number): Promise<any | null> => {
            const { data, error } = await supabase
                .from('folders')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching folder:', error);
                return null;
            }
            return data;
        },
        create: async (folderData: any): Promise<any> => {
            const { data, error } = await supabase
                .from('folders')
                .insert([folderData])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        update: async (id: number, updates: any): Promise<any> => {
            const { data, error } = await supabase
                .from('folders')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (id: number): Promise<void> => {
            const { error } = await supabase
                .from('folders')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    budget: {
        getSettings: async () => {
            // Strictly fetch ID 1 to ensure consistency
            const { data, error } = await supabase
                .from('budget_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "Row not found"
                console.error('Error fetching budget settings:', error);
                return null;
            }
            return data;
        },
        updateTotal: async (amount: number, updatedBy: string) => {
            // Force upsert on ID 1
            const { data, error } = await supabase
                .from('budget_settings')
                .upsert({
                    id: 1,
                    total_amount: amount,
                    updated_by: updatedBy,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        getAllAllocations: async () => {
            const { data, error } = await supabase
                .from('forum_budgets')
                .select('*')
                .order('forum_name');

            if (error) {
                console.error('Error fetching forum budgets:', error);
                return [];
            }
            return data || [];
        },
        updateAllocation: async (forumId: number, amount: number) => {
            const { data, error } = await supabase
                .from('forum_budgets')
                .update({ allocated_amount: amount, last_updated: new Date().toISOString() })
                .eq('id', forumId)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        createForum: async (name: string) => {
            const { data, error } = await supabase
                .from('forum_budgets')
                .insert([{ forum_name: name, allocated_amount: 0 }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        updateForumName: async (id: number, name: string) => {
            const { data, error } = await supabase
                .from('forum_budgets')
                .update({ forum_name: name })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },
    metrics: {
        get: async () => {
            const { data, error } = await supabase
                .from('dashboard_metrics')
                .select('*')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching dashboard metrics:', error);
                return null;
            }
            return data;
        },
        update: async (updates: { total_members?: string, upcoming_events?: string, active_projects?: string }) => {
            const { data, error } = await supabase
                .from('dashboard_metrics')
                .upsert({ id: 1, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' })
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }
};
