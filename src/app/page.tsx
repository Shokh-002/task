"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Typography, message, Card } from "antd";

const { Title } = Typography;

export default function CaptureForm() {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState();
  const [budgetFrom, setBudgetFrom] = useState();
  const [budgetTo, setBudgetTo] = useState();
  const [deadline, setDeadline] = useState();
  const [reminds, setReminds] = useState();

  useEffect(() => {
    const savedToken = localStorage.getItem("task_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSubmit = async (values) => {
    if (!values.token) {
      message.error("Введите токен!");
      return;
    }

    const url = `https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask?` +
      `token=${encodeURIComponent(values.token)}` +
      `&title=${encodeURIComponent(values.title)}` +
      `&description=${encodeURIComponent(values.description)}` +
      `&tags=${encodeURIComponent(values.tags)}` +
      `&budget_from=${values.budgetFrom}` +
      `&budget_to=${values.budgetTo}` +
      `&deadline=${values.deadline}` +
      `&reminds=${values.reminds}` +
      `&all_auto_responses=false` +
      `&rules=${encodeURIComponent(JSON.stringify({
        budget_from: 5000,
        budget_to: 8000,
        deadline_days: 5,
        qty_freelancers: 1
      }))}`;

    try {
      const response = await fetch(url, { method: "GET" });
      const result = await response.json();

      if (response.ok) {
        message.success(`✅ Задача успешно опубликована!`);
      } else {
        message.error(`❌ Ошибка: ${result.error || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.log(error)
      message.error("❌ Ошибка сети! Проверьте подключение.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <Title level={3}>Создание задачи</Title>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={{
          token, title, description, tags, budgetFrom, budgetTo, deadline, reminds
        }}>
          <Form.Item label="Токен" name="token" rules={[{ required: true, message: "Введите токен!" }]}>  
            <Input onChange={(e) => { setToken(e.target.value); localStorage.setItem("task_token", e.target.value); }} />
          </Form.Item>
          <Form.Item label="Название" name="title" rules={[{ required: true }]}>  
            <Input onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item label="Описание" name="description" rules={[{ required: true }]}>  
            <Input.TextArea onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item label="Теги (через запятую)" name="tags">  
            <Input onChange={(e) => setTags(e.target.value)} />
          </Form.Item>
          <Form.Item label="Бюджет от" name="budgetFrom">  
            <InputNumber className="w-full" min={0} onChange={(value) => setBudgetFrom(value)} />
          </Form.Item>
          <Form.Item label="Бюджет до" name="budgetTo">  
            <InputNumber className="w-full" min={0} onChange={(value) => setBudgetTo(value)} />
          </Form.Item>
          <Form.Item label="Дедлайн (в днях)" name="deadline">  
            <InputNumber className="w-full" min={1} onChange={(value) => setDeadline(value)} />
          </Form.Item>
          <Form.Item label="Напоминания" name="reminds">  
            <InputNumber className="w-full" min={0} onChange={(value) => setReminds(value)} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Создать задачу</Button>
        </Form>
      </Card>
    </div>
  );
}
