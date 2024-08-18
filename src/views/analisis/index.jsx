import React, { useState } from "react";
import axios from "axios";
import Report from "../report";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Slider,
  Row,
  Col,
  Button,
  Popconfirm,
  notification,
} from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LoadingOutlined } from "@ant-design/icons";
import { totalArrayObjectData } from "../../utils/format-text";
import { kategori } from "../../utils/kategori";

const { Title } = Typography;

const Analisis = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["list"],
    queryFn: () => axios.get("https://db-spending.glitch.me/spending"),
  });

  const listSpending = data?.data;

  const resetData = async (idList) => {
    const results = [];
    for (const id of idList) {
      const response = await axios.delete(
        `https://db-spending.glitch.me/spending/${id}`
      );
      results.push(response.data);
    }
    return results;
  };

  const { mutate } = useMutation({
    mutationFn: resetData,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      notification.success({
        message: "Berhasil me-reset data!",
      });
    },
    onError: () => {
      notification.error({
        message: "Gagal me-reset data!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("list");
      setLoading(false);
    },
  });

  const resetAll = () => {
    mutate(listSpending.map((item) => item.id));
  };

  return (
    <div>
      {isLoading ? (
        <div className="mt-14 flex justify-center">
          <LoadingOutlined className="text-7xl" />
        </div>
      ) : (
        <div className="m-5">
          <Title>Analisis Pengeluaran</Title>
          {kategori.map((item, index) => {
            const dataPengeluaran = listSpending.filter(
              (itemC) => itemC.kategori === item
            );
            const presentase =
              (totalArrayObjectData(dataPengeluaran, "jumlah") / 6000000) * 100;
            const rounded =
              Math.round((presentase + Number.EPSILON) * 100) / 100;
            return (
              <Row className="mt-6" key={index} align="middle">
                <Col span={18}>
                  <Title className="m-0" level={4}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Title>
                  <Slider min={1} max={100} value={rounded} />
                </Col>
                <Col>
                  <Title className="m-0" level={4}>
                    {rounded}%
                  </Title>
                </Col>
              </Row>
            );
          })}
          <div className="mt-20 w-1/3">
            <PDFDownloadLink
              className="w-full block"
              document={<Report />}
              fileName="Laporan Bulanan.pdf"
            >
              {({ blob, url, loading, error }) => (
                <Button className="w-full" type="primary" loading={loading}>
                  Download Report
                </Button>
              )}
            </PDFDownloadLink>
          </div>
          <Popconfirm
            className="mt-6 w-1/3"
            title="Reset Semua Data"
            description="Apakah kamu yakin akan me-reset semua data?"
            okText="Iya!"
            cancelText="Batal"
            onConfirm={resetAll}
          >
            <Button danger loading={loading}>
              Reset Semua
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

export default Analisis;
