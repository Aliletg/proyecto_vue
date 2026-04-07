<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <v-card elevation="4" class="rounded-lg">
      <v-toolbar color="primary" dark>
        <v-toolbar-title class="font-weight-bold">
          <v-icon icon="mdi-package-variant-closed" class="mr-2"></v-icon>
          Gestión de Productos
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" variant="elevated" color="white" @click="abrirDialogo">
          Nuevo Producto
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="productos"
        hover
        no-data-text="No hay productos disponibles"
      >
        <template v-slot:item.precio_final="{ item }">
          <v-chip color="success" font-weight="bold">
            ${{ Number(item.precio_final).toFixed(2) }}
          </v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="editar(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="red" @click="confirmarEliminar(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="bg-grey-lighten-3 py-4">
          <span class="text-h5">{{ editando ? "Editar Producto" : "Nuevo Producto" }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="form.codigo" label="Código" variant="outlined" prepend-inner-icon="mdi-barcode"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.nombre" label="Nombre del Producto" variant="outlined" prepend-inner-icon="mdi-format-title"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="form.precio" label="Precio" type="number" variant="outlined" prefix="$"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="form.impuesto" label="% Impuesto" type="number" variant="outlined" suffix="%"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="guardar" :loading="cargando">
            {{ editando ? "Actualizar" : "Guardar Producto" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import productoService from "@/services/productServices";

export default {
  data() {
    return {
      productos: [],
      dialog: false,
      editando: false,
      cargando: false,
      snackbar: {
        show: false,
        text: "",
        color: "success"
      },
      headers: [
        { title: 'Código', key: 'codigo' },
        { title: 'Nombre', key: 'nombre' },
        { title: 'Precio', key: 'precio' },
        { title: 'Impuesto %', key: 'impuesto' },
        { title: 'Total', key: 'precio_final' },
        { title: 'Acciones', key: 'acciones', sortable: false },
      ],
      form: { id: null, codigo: "", nombre: "", precio: 0, impuesto: 0 }
    };
  },

  mounted() {
    this.obtenerProductos();
  },

  methods: {
    mostrarAlerta(mensaje, color = "success") {
      this.snackbar.text = mensaje;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    obtenerProductos() {
      productoService.getProductos().then(res => {
        this.productos = res.data;
      });
    },

    abrirDialogo() {
      this.editando = false;
      this.form = { id: null, codigo: "", nombre: "", precio: 0, impuesto: 0 };
      this.dialog = true;
    },

    editar(producto) {
      this.editando = true;
      this.form = { ...producto };
      this.dialog = true;
    },

    async guardar() {
      this.cargando = true;
      try {
        if (this.editando) {
          await productoService.actualizarProducto(this.form.id, this.form);
          this.mostrarAlerta("¡Producto actualizado con éxito!");
        } else {
          await productoService.crearProducto(this.form);
          this.mostrarAlerta("¡Producto registrado correctamente!");
        }
        this.obtenerProductos();
        this.dialog = false;
      } catch (error) {
        this.mostrarAlerta("Error al procesar la solicitud", "error");
      } finally {
        this.cargando = false;
      }
    },

    confirmarEliminar(item) {
      if (confirm(`¿Estás seguro de eliminar ${item.nombre}?`)) {
        productoService.eliminarProducto(item.id).then(() => {
          this.mostrarAlerta("Producto eliminado", "black");
          this.obtenerProductos();
        });
      }
    }
  }
};
</script>


