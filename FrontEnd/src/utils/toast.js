import Swal from "sweetalert2";

export const toast = {
  success: (title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 2000,
      background: "#1e293b",
      color: "#fff",
    });
  },
  error: (title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: title,
      showConfirmButton: false,
      timer: 3000,
      background: "#1e293b",
      color: "#fff",
    });
  },
};
