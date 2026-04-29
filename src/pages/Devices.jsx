import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    loadDevices();

    // ⚡ REAL-TIME SUBSCRIPTION
    const unsubscribe = pb.collection('devices').subscribe('*', (e) => {
      console.log('Realtime event:', e);

      if (e.action === 'create') {
        setDevices((prev) => [...prev, e.record]);
      }

      if (e.action === 'delete') {
        setDevices((prev) =>
          prev.filter((d) => d.id !== e.record.id)
        );
      }

      if (e.action === 'update') {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === e.record.id ? e.record : d
          )
        );
      }
    });

    const authSub = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return () => {
      pb.collection('devices').unsubscribe('*');
      authSub?.();
    };
  }, []);

  const loadDevices = async () => {
    const data = await pb.collection('devices').getFullList();
    setDevices(data);
  };

  // 🔐 LOGIN
  const login = async () => {
    const email = prompt('Email');
    const password = prompt('Password');

    if (!email || !password) return;

    try {
      await pb.collection('users').authWithPassword(email, password);
      setUser(pb.authStore.model);
    } catch {
      alert('Login failed');
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  // ➕ ADD DEVICE
  const addDevice = async () => {
    const name = prompt('Device name');
    const serial = prompt('Serial');

    if (!name || !serial) return;

    await pb.collection('devices').create({
      name,
      serial,
      status: 'in_stock',
    });
  };

  // ✏️ EDIT DEVICE
  const editDevice = async (device) => {
    const name = prompt('Name', device.name);
    const serial = prompt('Serial', device.serial);
    const status = prompt('Status', device.status);

    if (!name || !serial || !status) return;

    await pb.collection('devices').update(device.id, {
      name,
      serial,
      status,
    });
  };

  // 🗑 DELETE DEVICE
  const deleteDevice = async (id) => {
    if (!confirm('Delete device?')) return;

    await pb.collection('devices').delete(id);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📦 Devices (Real-time)</h2>

          <div style={styles.userBox}>
            {user ? (
              <>
                <div>👤 {user.email}</div>
                <div style={styles.role}>
                  role: {user.role || 'user'}
                </div>
              </>
            ) : (
              <div>Not logged in</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!user && (
            <button style={styles.login} onClick={login}>
              Login
            </button>
          )}

          {user?.role === 'admin' && (
            <button style={styles.button} onClick={addDevice}>
              + Add Device
            </button>
          )}

          {user && (
            <button style={styles.logout} onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {devices.map((d) => (
          <div key={d.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.name}>
                {d.name || 'No name'}
              </div>

              <span style={styles.badge}>{d.status}</span>
            </div>

            <div style={styles.meta}>
              Serial: <span style={styles.mono}>{d.serial}</span>
            </div>

            {/* ADMIN ACTIONS */}
            {user?.role === 'admin' && (
              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => editDevice(d)}
                >
                  ✏️ Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteDevice(d.id)}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    padding: '24px',
    background: '#f6f7fb',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },

  title: {
    margin: 0,
    fontSize: '24px',
  },

  userBox: {
    marginTop: '8px',
    fontSize: '14px',
    padding: '8px 10px',
    background: 'white',
    borderRadius: '10px',
  },

  role: {
    fontSize: '12px',
    color: '#666',
  },

  login: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    background: '#10b981',
    color: 'white',
    cursor: 'pointer',
  },

  button: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    background: '#2563eb',
    color: 'white',
    cursor: 'pointer',
  },

  logout: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },

  card: {
    background: 'white',
    padding: '16px',
    borderRadius: '14px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  },

  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  name: {
    fontWeight: 600,
  },

  badge: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '999px',
    background: '#eef2ff',
  },

  meta: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#666',
  },

  mono: {
    fontFamily: 'monospace',
  },

  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },

  editBtn: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#f3f4f6',
    cursor: 'pointer',
  },

  deleteBtn: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    cursor: 'pointer',
  },
};