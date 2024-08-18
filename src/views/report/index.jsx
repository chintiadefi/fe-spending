import React, { useState, useEffect } from "react";
import axios from "axios";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import dayjs from "../../utils/moment";
import { kategori } from "../../utils/kategori";
import {
  totalArrayObjectData,
  formatNumberToRupiah,
} from "../../utils/format-text";

const styles = StyleSheet.create({
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 10,
    color: "#1677FF",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 10,
    color: "#1677FF",
  },
  tableTitle: {
    marginTop: 10,
    padding: 8,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
  },
  tableColumn: {
    marginTop: 5,
    padding: 8,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const Report = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("https://db-spending.glitch.me/spending");
    return setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const now = dayjs(new Date()).format("DD MMMM YYYY - HH:mm");
  const month = dayjs(new Date()).format("MMMM");
  const totalPengeluaran = totalArrayObjectData(data, "jumlah");

  return (
    <Document>
      <Page size="A4" style={{ padding: 18 }}>
        <View>
          <Text style={styles.title}>Laporan Pengeluaran Bulan {month}</Text>
          <Text style={{ fontSize: 12, textAlign: "center" }}>
            Diunduh pada {now}
          </Text>
          {kategori.map((item, index) => {
            const dataPengeluaran = data.filter(
              (itemC) => itemC.kategori === item
            );
            if (dataPengeluaran.length > 0)
              return (
                <View
                  key={index}
                  style={{
                    marginTop: "10px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Text style={styles.subTitle}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                  <View style={styles.tableTitle}>
                    <View style={{ width: "30%" }}>
                      <Text style={{ fontSize: 14 }}>Nama Pengeluaran</Text>
                    </View>
                    <View style={{ width: "30%" }}>
                      <Text style={{ fontSize: 14 }}>Tanggal</Text>
                    </View>
                    <View style={{ width: "30%" }}>
                      <Text style={{ fontSize: 14 }}>Jumlah</Text>
                    </View>
                  </View>
                  {dataPengeluaran.map((itemT, indexT) => {
                    const colorDanger =
                      (item === "tagihan" && itemT.jumlah > 1000000) ||
                      (item === "hiburan" && itemT.jumlah > 150000) ||
                      (item === "makanan" && itemT.jumlah > 100000);
                    return (
                      <View key={indexT} style={styles.tableColumn}>
                        <View style={{ width: "30%" }}>
                          <Text style={{ fontSize: 12 }}>{itemT.nama}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text style={{ fontSize: 12 }}>
                            {dayjs(itemT.tanggal).format("DD MMM")}
                          </Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colorDanger ? "#FF0000" : "#000000",
                            }}
                          >
                            {formatNumberToRupiah(itemT.jumlah)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <Text style={{ ...styles.subTitle, marginBottom: 10 }}>
                    Total:{" "}
                    {formatNumberToRupiah(
                      totalArrayObjectData(dataPengeluaran, "jumlah")
                    )}
                  </Text>
                </View>
              );
          })}
          <Text style={styles.subTitle}>
            Total Pengeluaran: {formatNumberToRupiah(totalPengeluaran)}
          </Text>
          <Text style={styles.subTitle}>
            Sisa Uang Bulanan:{" "}
            {formatNumberToRupiah(6000000 - totalPengeluaran)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Report;
