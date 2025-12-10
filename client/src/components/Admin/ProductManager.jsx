import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Image, Tag, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UploadOutlined, ExperimentOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProductManager = () => {
    // Khởi tạo là mảng rỗng [] để tránh lỗi map lúc đầu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [currentProductForRecipe, setCurrentProductForRecipe] = useState(null);
    const [allIngredients, setAllIngredients] = useState([]); // List nguyên liệu để chọn
    const [recipeForm] = Form.useForm();

    // 1. Load dữ liệu (Món ăn + Danh mục)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:8081/api/products'),
                axios.get('http://localhost:8081/api/categories')
            ]);
            
            // --- BẢO VỆ: Kiểm tra kỹ dữ liệu trước khi set ---
            if (Array.isArray(prodRes.data)) {
                setProducts(prodRes.data);
            } else {
                console.warn("API Products trả về lỗi:", prodRes.data);
                setProducts([]); 
            }

            if (Array.isArray(catRes.data)) {
                setCategories(catRes.data);
            } else {
                console.warn("API Categories trả về lỗi:", catRes.data);
                setCategories([]); 
            }
            // --------------------------------------------------

        } catch (error) {
            console.error("Lỗi gọi API:", error);
            message.error('Không thể kết nối đến server!');
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchIngredients = async () => {
        const res = await axios.get('http://localhost:8081/api/inventory');
        setAllIngredients(res.data);
    };

    // Hàm mở Modal Công thức
    const openRecipeModal = async (product) => {
        setCurrentProductForRecipe(product);
        setIsRecipeModalOpen(true);
        await fetchIngredients(); // Tải danh sách nguyên liệu mới nhất
        
        // Tải công thức hiện tại của món này (nếu có)
        try {
            const res = await axios.get(`http://localhost:8081/api/products/${product.id}/ingredients`);
            // Format lại dữ liệu để đổ vào Form (Ant Design Dynamic Form)
            const formattedData = res.data.map(item => ({
                ingredientId: item.ingredient.id,
                quantity: item.quantityNeeded
            }));
            recipeForm.setFieldsValue({ ingredients: formattedData });
        } catch (e) {
            recipeForm.resetFields();
        }
    };

    // Hàm lưu công thức
    const handleSaveRecipe = async (values) => {
        try {
            await axios.post(`http://localhost:8081/api/products/${currentProductForRecipe.id}/ingredients`, values.ingredients);
            message.success('Lưu công thức thành công!');
            setIsRecipeModalOpen(false);
        } catch (error) {
            message.error('Lỗi lưu công thức!');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Xử lý Submit Form
    const handleFinish = async (values) => {
        try {
            if (editingProduct) {
                await axios.put(`http://localhost:8081/api/products/${editingProduct.id}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axios.post('http://localhost:8081/api/products', values);
                message.success('Thêm mới thành công!');
            }
            fetchData();
            setIsModalOpen(false);
            form.resetFields();
            setEditingProduct(null);
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/products/${id}`);
            message.success('Đã xóa!');
            fetchData();
        } catch (error) {
            message.error('Lỗi khi xóa (có thể món đang có trong đơn hàng)!');
        }
    };

    const openEditModal = (record) => {
        setEditingProduct(record);
        form.setFieldsValue({
            ...record,
            categoryId: record.category ? record.category.id : null
        });
        setIsModalOpen(true);
    };

    // --- BẢO VỆ: Đảm bảo danh sách categories luôn là mảng ---
    const safeCategories = Array.isArray(categories) ? categories : [];

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
        { 
            title: 'Hình ảnh', 
            dataIndex: 'imageUrl', 
            width: 100,
            render: (url) => <Image src={url || "error"} fallback="https://placehold.co/100?text=No+Img" width={60} height={60} className="object-cover rounded border"/> 
        },
        { 
            title: 'Tên món', 
            dataIndex: 'name', 
            className: 'font-semibold',
            render: (text, record) => (
                <div>
                    <div className="text-base">{text}</div>
                    <div className="text-gray-400 text-xs truncate w-40">{record.description}</div>
                </div>
            )
        },
        { 
            title: 'Giá bán', 
            dataIndex: 'price', 
            width: 120,
            render: (price) => <span className="text-green-600 font-bold">{price?.toLocaleString()} đ</span>,
            sorter: (a, b) => a.price - b.price 
        },
        { 
            title: 'Danh mục', 
            dataIndex: 'category',
            width: 150,
            render: (cat) => cat ? <Tag color="blue">{cat.name}</Tag> : <Tag color="red">Chưa phân loại</Tag>,
            filters: safeCategories.map(c => ({ text: c.name, value: c.id })),
            onFilter: (value, record) => record.category?.id === value,
        },
        {
            title: 'Hành động',
            width: 150,
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* NÚT CÔNG THỨC MỚI */}
                    <Button 
                        icon={<ExperimentOutlined />} 
                        className="text-purple-600 border-purple-600"
                        title="Thiết lập công thức"
                        onClick={() => openRecipeModal(record)} 
                    />
                    
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Popconfirm title="Xóa món này?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">Quản lý Thực đơn</h3>
                <div className="flex gap-2">
                    <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true); }}>
                        Thêm Món Mới
                    </Button>
                </div>
            </div>

            <Table 
                dataSource={Array.isArray(products) ? products : []} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                bordered 
                pagination={{ pageSize: 6 }} 
            />

            <Modal
                title={editingProduct ? "Cập nhật món ăn" : "Thêm món ăn mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Tên món ăn" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                            <InputNumber 
                                style={{ width: '100%' }} 
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                            />
                        </Form.Item>
                        
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                            <Select placeholder="-- Chọn danh mục --">
                                {safeCategories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    {/* --- PHẦN UPLOAD ẢNH --- */}
                    <Form.Item label="Hình ảnh món ăn">
                        {/* Input ẩn để giữ giá trị URL gửi đi khi submit */}
                        <Form.Item name="imageUrl" noStyle>
                            <Input hidden />
                        </Form.Item>

                        <Upload
                            name="file"
                            action="http://localhost:8081/api/upload" // API upload của Backend
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    // Lấy đường dẫn ảnh từ server trả về gán vào Form
                                    const url = info.file.response.url;
                                    form.setFieldsValue({ imageUrl: url });
                                    message.success('Upload ảnh thành công!');
                                } else if (info.file.status === 'error') {
                                    message.error('Upload thất bại.');
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên (Click)</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="imageUrl" label="Hoặc nhập link ảnh (nếu không upload)">
                        <Input placeholder="http://..." />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Thành phần, ghi chú..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* --- MODAL CÔNG THỨC (MỚI) --- */}
            <Modal
                title={`Công thức: ${currentProductForRecipe?.name}`}
                open={isRecipeModalOpen}
                onCancel={() => setIsRecipeModalOpen(false)}
                onOk={() => recipeForm.submit()}
                width={600}
            >
                <div className="mb-4 text-gray-500 italic">
                    Định lượng nguyên liệu sẽ bị trừ kho khi bán 1 đơn vị món này.
                </div>
                <Form form={recipeForm} onFinish={handleSaveRecipe} layout="vertical">
                    <Form.List name="ingredients">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'ingredientId']}
                                            rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
                                            style={{ width: 250 }}
                                        >
                                            <Select placeholder="Chọn nguyên liệu">
                                                {allIngredients.map(ing => (
                                                    <Select.Option key={ing.id} value={ing.id}>
                                                        {ing.name} (Tồn: {ing.quantity} {ing.unit})
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'Nhập số lượng' }]}
                                        >
                                            <InputNumber placeholder="Số lượng" min={0} step={0.01} style={{ width: 120 }} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm nguyên liệu
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;