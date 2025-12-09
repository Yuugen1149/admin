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
    }
};
