import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button, Input, Card, Avatar, Spin } from "antd";
import { RobotOutlined, SendOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng khung chat
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! 👋 Mình là AI trợ lý ảo. Bạn muốn ăn gì hôm nay?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => scrollToBottom(), [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Hiện tin nhắn của người dùng ngay lập tức
        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // 2. Gửi tin nhắn xuống Backend
            const res = await axios.post("/api/chat", { message: userMsg.text });
            
            // 3. Nhận câu trả lời từ AI và hiển thị
            const botMsg = { sender: "bot", text: res.data.reply };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "Lỗi kết nối! Bạn kiểm tra lại Backend nhé 😢" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 9999 }}>
            {/* Nút tròn để mở Chat */}
            {!isOpen && (
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<RobotOutlined style={{ fontSize: 28 }} />} 
                    size="large"
                    style={{ width: 60, height: 60, boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
                    onClick={() => setIsOpen(true)}
                />
            )}

            {/* Khung Chat */}
            {isOpen && (
                <Card 
                    title={
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <RobotOutlined style={{ color: "#1890ff", fontSize: 20 }} /> 
                            <span>Trợ lý FastFood AI</span>
                        </div>
                    }
                    extra={<Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />}
                    style={{ width: 340, height: 480, display: "flex", flexDirection: "column", boxShadow: "0 5px 20px rgba(0,0,0,0.2)", borderRadius: 15, overflow: "hidden" }}
                    bodyStyle={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f9f9f9" }}
                >
                    {/* Khu vực hiển thị nội dung chat */}
                    <div style={{ flex: 1, overflowY: "auto", marginBottom: 10, paddingRight: 5 }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                                {msg.sender === "bot" && <Avatar icon={<RobotOutlined />} style={{ marginRight: 8, backgroundColor: "#ff9c6e" }} />}
                                <div style={{
                                    maxWidth: "75%",
                                    padding: "8px 14px",
                                    borderRadius: 12,
                                    borderTopLeftRadius: msg.sender === "bot" ? 2 : 12,
                                    borderTopRightRadius: msg.sender === "user" ? 2 : 12,
                                    backgroundColor: msg.sender === "user" ? "#1890ff" : "#fff",
                                    color: msg.sender === "user" ? "#fff" : "#333",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                    fontSize: 14
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div style={{ marginLeft: 40, color: "#999", fontSize: 12 }}>AI đang suy nghĩ... <Spin size="small"/></div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô nhập liệu */}
                    <div style={{ display: "flex", gap: 8, borderTop: "1px solid #eee", paddingTop: 10 }}>
                        <Input 
                            placeholder="Hỏi món ăn..." 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onPressEnter={handleSend}
                            disabled={loading}
                            style={{ borderRadius: 20 }}
                        />
                        <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSend} loading={loading} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ChatBot;