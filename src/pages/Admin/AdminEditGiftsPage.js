import React, { useState, useEffect } from 'react';
import { getGifts, adminAddGift, adminUpdateGift, adminDeleteGift } from '../../services/api';
import './Admin.css';

const AdminEditGiftsPage = () => {
  const [gifts, setGifts] = useState([]);
  const [newGift, setNewGift] = useState({ name: '', image: null, order: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', order: '', image: null });

  const fetchGifts = async () => {
    const res = await getGifts();
    setGifts(res.data);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGift.name || !newGift.image || !newGift.order) return alert('Fill all fields');
    await adminAddGift(newGift);
    setNewGift({ name: '', image: null, order: '' });
    fetchGifts();
  };

  const handleEdit = (gift) => {
    setEditingId(gift._id);
    setEditForm({ name: gift.name, order: gift.order, image: null });
  };

  const handleUpdate = async (id) => {
    await adminUpdateGift(id, editForm);
    setEditingId(null);
    fetchGifts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this gift?')) {
      await adminDeleteGift(id);
      fetchGifts();
    }
  };

  return (
    <div className="admin-gifts">
      <h2>Manage Gifts</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Gift name"
          value={newGift.name}
          onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewGift({ ...newGift, image: e.target.files[0] })}
        />
        <input
          type="number"
          placeholder="Order"
          value={newGift.order}
          onChange={(e) => setNewGift({ ...newGift, order: e.target.value })}
        />
        <button type="submit">Add Gift</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift._id}>
              <td><img src={gift.image} alt={gift.name} width="50" /></td>
              <td>
                {editingId === gift._id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                ) : (
                  gift.name
                )}
              </td>
              <td>
                {editingId === gift._id ? (
                  <input
                    type="number"
                    value={editForm.order}
                    onChange={(e) => setEditForm({ ...editForm, order: e.target.value })}
                  />
                ) : (
                  gift.order
                )}
              </td>
              <td>
                {editingId === gift._id ? (
                  <>
                    <input type="file" onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })} />
                    <button onClick={() => handleUpdate(gift._id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(gift)}>Edit</button>
                    <button onClick={() => handleDelete(gift._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEditGiftsPage;