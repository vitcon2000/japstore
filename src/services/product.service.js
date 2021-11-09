import http from "../http-common";
class ProductService {
  getStatus() {
    return http.get("/product/status");
  }
  getPacking() {
    return http.get("/product/packing");
  }
  getOrgin() {
    return http.get("/product/origin");
  }
  getStore() {
    return http.get("/store/get");
  }
  create(data) {
    let formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("size", data.size);
    formData.append("weight", data.weight);
    formData.append("quantity", data.quantity);
    formData.append("manufacturer", data.manufacturer);
    formData.append("shortDescription", data.shortDes);
    formData.append("description", data.des);
    formData.append("brand", data.brand);
    formData.append("originId", data.originId);
    formData.append("packingMethodId", data.packingMethodId);
    formData.append("productStatusId", data.statusId);
    formData.append("storageId", data.storageId);
    formData.append("displayImage", data.displayImage);
    return http.post("/product/create", formData);
  }
  getList(quantity) {
    return http.get("/product/getlist?quantity=" + quantity);
  }
  search(text, currentPage, pageSize) {
    return http.get(
      "/product/search?querySearch=" +
        text +
        "&CurrentPage=" +
        currentPage +
        "&PageSize=" +
        pageSize
    );
  }
  getDetail(productId) {
    return http.get("/product/get/" + productId);
  }
}
export default new ProductService();
