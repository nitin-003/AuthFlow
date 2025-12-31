import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({
    fetchProducts,
    selectedProduct,
    setSelectedProduct,
    onClose,
}) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        unit: "",
        price: "",
        quantity: "",
        category: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name ?? "",
                sku: selectedProduct.sku ?? "",
                unit: selectedProduct.unit ?? "",
                price: selectedProduct.price ?? "",
                category: selectedProduct.category ?? "",
                quantity: "",
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                sku: formData.sku,
                unit: formData.unit,
                price: Number(formData.price),
                category: formData.category,
            };

            if (!selectedProduct) payload.quantity = Number(formData.quantity);

            selectedProduct
                ? await api.patch(`/products/${selectedProduct._id}`, payload)
                : await api.post("/products", payload);

            toast.success(
                selectedProduct ? "Product updated successfully" : "Product created successfully"
            );

            fetchProducts();
            setSelectedProduct(null);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg
                 max-h-[85vh] overflow-y-auto px-6 py-5 space-y-5"
        >
            {/* TITLE */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">
                    {selectedProduct ? "Update Product" : "Add Product"}
                </h3>
                <p className="text-xs font-bold text-gray-500 mt-1">
                    {selectedProduct
                        ? "Edit product details below"
                        : "Fill details to add a new product"}
                </p>
            </div>

            {/* FORM BODY */}
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NAME */}
                <div className="sm:col-span-2">
                    <label className="label font-bold">Product Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Apple iPhone 15"
                        required
                        className="input"
                    />
                </div>

                {/* SKU */}
                <div>
                    <label className="label font-bold">SKU</label>
                    <input
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        disabled={Boolean(selectedProduct)}   // 🔒 disabled only on edit
                        placeholder={selectedProduct ? "" : "Unique product code"}
                        className={`input ${selectedProduct
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : ""
                            }`}
                    />
                    {selectedProduct && (
                        <p className="hint">SKU cannot be changed once created</p>
                    )}
                </div>


                {/* UNIT */}
                <div>
                    <label className="label font-bold">Unit</label>
                    <input
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="pcs / kg / box / litre"
                        className="input"
                    />
                </div>

                {/* PRICE */}
                <div>
                    <label className="label font-bold">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        className="input"
                    />
                </div>

                {/* QUANTITY */}
                {!selectedProduct && (
                    <div>
                        <label className="label font-bold">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Initial stock"
                            required
                            className="input"
                        />
                    </div>
                )}

                {/* CATEGORY */}
                <div className="sm:col-span-2">
                    <label className="label font-bold">Category</label>
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Electronics / Furniture"
                        required
                        className="input font-bold"
                    />
                </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? "Saving..." : selectedProduct ? "Update Product" : "Add Product"}
                </button>
            </div>
        </form>
    );
}

