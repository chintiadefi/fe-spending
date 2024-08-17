import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  notification,
} from "antd";
import { kategori } from "../../utils/kategori";
import dayjs from "../../utils/moment";

const { Title } = Typography;

const InputC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const addInput = async ({ payload }) => {
    const response = await axios.post(
      "https://db-spending.glitch.me/spending",
      { ...payload }
    );
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: addInput,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      notification.success({
        message: "Berhasil menambahkan pengeluaran!",
      });
      form.resetFields();
    },
    onError: () => {
      notification.error({
        message: "Gagal menambahkan pengeluaran!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("list");
      setLoading(false);
    },
  });

  const onSubmit = (value) => {
    const today = dayjs(new Date());
    const payload = {
      nama: value.nama,
      kategori: value.kategori,
      jumlah: value.jumlah,
      tanggal: today,
    };

    mutate({ payload });
  };

  return (
    <div className="m-5">
      <Title level={2}>Input Pengeluaran</Title>
      <Form
        form={form}
        name="input"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSubmit}
        initialValues={{
          kategori: "makanan",
        }}
      >
        <Form.Item label="Nama Pengeluaran" name="nama" required>
          <Input />
        </Form.Item>
        <Form.Item label="Kategori Pengeluaran" name="kategori" required>
          <Select
            options={kategori.map((item) => ({
              value: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            }))}
          />
        </Form.Item>
        <Form.Item label="Jumlah Pengeluaran (Rp)" name="jumlah" required>
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item>
          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Input
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputC;
