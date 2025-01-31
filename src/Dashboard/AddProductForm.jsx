import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Add Axios import
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Grid,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const AddProductForm = ({ isOpen, onClose, productId, initialProductData, initialCategories = [], onUpdate }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        status: '',
        weight: '',
        dimensions: {
            length: '',
            width: '',
            height: ''
        },
        shippingClass: '',
        features: [],
        images: []
    });
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            if (productId) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
                    const product = response.data;

                    console.log('Fetched product:', product);

                    setFormData({
                        name: product.name || "",
                        sku: product.sku || "",
                        price: product.price || "",
                        stock: product.stock || "",
                        category: product.category,
                        description: product.description || "",
                        status: product.status || "",
                        weight: product.weight || "",
                        dimensions: product.dimensions || { length: '', width: '', height: '' },
                        shippingClass: product.shippingClass || "",
                        features: product.features || [],
                        images: product.images || []
                    });
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            }
        };

        fetchProductData();
    }, [productId, isOpen, categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, newFeature]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (featureToRemove) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((feature) => feature !== featureToRemove)
        }));
    };

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            dimensions: {
                ...prev.dimensions,
                [name]: value
            }
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 20 * 1024 * 1024; // 20 MB

        for (const file of files) {
            if (file.size > maxSize) {
                // alert(`File ${file.name} is too large. Please upload a file smaller than 20 MB.`);
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],  // Append new images to the existing ones
        }));
    };

    // Optionally, add a remove image functionality:
    const handleRemoveImage = (imageToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((image) => image !== imageToRemove),
        }));
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories((prev) => [...prev, newCategory]);
            setFormData((prev) => ({ ...prev, category: newCategory }));
            setNewCategory('');
            setIsAddingCategory(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
    
        // Append all the non-image data
        for (const [key, value] of Object.entries(formData)) {
            if (key !== 'images' && key !== 'dimensions') {
                formDataToSend.append(key, value);
            }
        }
    
        // Append the 'dimensions' fields separately
        const { length, width, height } = formData.dimensions;
        formDataToSend.append('dimensions[length]', length);
        formDataToSend.append('dimensions[width]', width);
        formDataToSend.append('dimensions[height]', height);
    
        // Append images as files (only the new images)
        formData.images.forEach((image) => {
            formDataToSend.append('images', image);
        });
    
        try {
            const url = productId
                ? `http://localhost:3000/api/products/${productId}` 
                : 'http://localhost:3000/api/products';  
    
            const method = productId ? 'put' : 'post';
    
            const response = await axios({
                method,
                url,
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201 || response.status === 200) {
                // alert('Product ' + (productId ? 'updated' : 'created') + ' successfully!');
                onUpdate(); 
                onClose();  // Close the form
            }
        } catch (error) {
            console.error("Error details:", error);  // Log the error details for debugging
            // alert('Error ' + (productId ? 'updating' : 'creating') + ' product: ' + (error.response?.data?.error || error.message));
        }
    };


    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {productId ? 'Edit Product' : 'Add New Product'}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Price ($)"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Stock Quantity"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    label="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        if (e.target.value === 'add-category') {
                                            setIsAddingCategory(true);
                                        } else {
                                            setFormData((prev) => ({ ...prev, category: e.target.value }));
                                        }
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="add-category">
                                        <em>Add Category</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {isAddingCategory && (
                                <div style={{ marginTop: 10 }}>
                                    <TextField
                                        fullWidth
                                        label="New Category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddCategory}
                                        disabled={!newCategory.trim()}
                                        style={{ marginTop: 10 }}
                                    >
                                        Add Category
                                    </Button>
                                </div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Product Status</FormLabel>
                                <RadioGroup
                                    row
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                                    <FormControlLabel value="archived" control={<Radio />} label="Archived" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Shipping Class</InputLabel>
                                <Select
                                    name="shippingClass"
                                    label="shippingClass"
                                    value={formData.shippingClass}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="standard">Standard</MenuItem>
                                    <MenuItem value="express">Express</MenuItem>
                                    <MenuItem value="free">Free Shipping</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Features
                            </Typography>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
                                <TextField
                                    fullWidth
                                    label="Add Feature"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddFeature}
                                    disabled={!newFeature.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Features"
                                value={formData.features.join(', ')}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        {/* Shipping Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Shipping Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Weight (kg)"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                inputProps={{ min: 0, step: 0.1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Length (cm)"
                                name="length"
                                value={formData.dimensions.length}
                                onChange={handleDimensionChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Width (cm)"
                                name="width"
                                value={formData.dimensions.width}
                                onChange={handleDimensionChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Height (cm)"
                                name="height"
                                value={formData.dimensions.height}
                                onChange={handleDimensionChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Image Upload */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Product Images</Typography>
                            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                                Upload Images
                                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                            </Button>
                            <Typography variant="body2" color="textSecondary">
                                {formData.images.length} image(s) selected
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {productId ? 'Update Product' : 'Create Product'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddProductForm;