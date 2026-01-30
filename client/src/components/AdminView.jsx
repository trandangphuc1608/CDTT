import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminView = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, completedOrders: 0, pendingOrders: 0 });
  const [form, setForm] = useState({ name: "", price: "", imageUrl: "", description: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get("/api/products").then((res) => setProducts(res.data));
    axios.get("/api/orders/stats").then((res) => setStats(res.data));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa món này?")) {
      try {
        await axios.delete(`/api/products/${id}`);
        loadData();
      } catch (e) { alert("Không thể xóa món đang có trong đơn hàng cũ!"); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { ...form, category: { id: 1 } }; 
    try {
      await axios.post("/api/products", newProduct);
      alert("Thêm món thành công!");
      setForm({ name: "", price: "", imageUrl: "", description: "" });
      loadData();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="row g-4">
      {/* Dashboard Stats */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card text-white bg-success h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="fs-5">Tổng Doanh Thu</div>
                <div className="display-6 fw-bold">{stats.totalRevenue.toLocaleString()} đ</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-info h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="fs-5">Đơn Hoàn Thành</div>
                <div className="display-6 fw-bold">{stats.completedOrders}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning h-100 shadow-sm">
              <div className="card-body text-center">
                <div className="fs-5 text-dark">Đơn Đang Chờ</div>
                <div className="display-6 fw-bold text-dark">{stats.pendingOrders}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form & List */}
      <div className="col-md-4">
        <div className="card p-3 shadow">
          <h5 className="mb-3">➕ Thêm Món Mới</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">Tên món</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Giá bán</label>
              <input className="form-control" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Mô tả</label>
              <input className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">URL Hình ảnh</label>
              <input className="form-control" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
            </div>
            <button className="btn btn-primary w-100">Lưu Món Ăn</button>
          </form>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-header bg-white fw-bold">📋 Danh sách món ăn</div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>ID</th><th>Hình</th><th>Tên Món</th><th>Giá</th><th>Thao tác</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><img src={p.imageUrl} alt="" style={{height: '40px', width: '40px', objectFit: 'cover', borderRadius: '5px'}}/></td>
                    <td>
                      <div className="fw-bold">{p.name}</div>
                      <small className="text-muted">{p.description}</small>
                    </td>
                    <td className="text-success fw-bold">{p.price.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;