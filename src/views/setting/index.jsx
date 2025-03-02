import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Typography, Form, Button, InputNumber, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "../../utils/moment";

const { Title } = Typography;

const Setting = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["budget"],
    queryFn: () => axios.get("https://db-spending.glitch.me/spending/12"),
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ jumlah: data?.data?.jumlah });
    }
  }, [data]);

  const editBudget = async ({ payload }) => {
    const response = await axios.put(
      "https://db-spending.glitch.me/spending/12",
      { ...payload }
    );
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: editBudget,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      notification.success({
        message: "Berhasil merubah jumlah anggaran belanja bulanan!",
      });
      form.resetFields();
    },
    onError: () => {
      notification.error({
        message: "Gagal merubah jumlah anggaran belanja bulanan!",
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
      nama: "Budget",
      kategori: "budget",
      jumlah: value.jumlah,
      tanggal: today,
    };

    mutate({ payload });
  };

  return (
    <div className="m-5">
      <Title level={2}>Pengaturan Jumlah Anggaran Belanja Bulanan</Title>
      {isLoading ? (
        <div className="mt-14 flex justify-center">
          <LoadingOutlined className="text-7xl" />
        </div>
      ) : (
        <Form
          form={form}
          name="input"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 12 }}
          onFinish={onSubmit}
        >
          <Form.Item
            label="Jumlah Anggaran Belanja Bulanan (Rp)"
            name="jumlah"
            required
          >
            <InputNumber
              className="w-full"
              prefix="Rp"
              min={0}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) =>
                value ? value.replace(/Rp\s?|(\.)/g, "") : ""
              }
              onKeyPress={(event) => {
                if (!/[\d]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
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
      )}
    </div>
  );
};

export default Setting;
