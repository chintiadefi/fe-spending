export function totalArrayObjectData(arr, key) {
  return arr
    ?.filter((item) => item.kategori !== "budget")
    .reduce((total, obj) => {
      return total + (obj[key] || 0);
    }, 0);
}

export function formatNumberToRupiah(number) {
  return number?.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
}
