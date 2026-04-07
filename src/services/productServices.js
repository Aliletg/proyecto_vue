import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products";

export default {

  getProductos() {
    return axios.get(API_URL);
  },

  crearProducto(data) {
    return axios.post(API_URL, data);
  },

  actualizarProducto(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  },

  eliminarProducto(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

};

