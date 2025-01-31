import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PackageIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UsersIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddProductForm from './AddProductForm';
import axios from 'axios';

const SellerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/customers');
      console.log('Fetched customers:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };


  const handleAddProduct = async (newProduct) => {
    try {
      // Send new product data to the API
      const response = await axios.post('http://localhost:3000/api/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {

        fetchProducts();
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product!');
    }
  };

  const deleteProduct = async (id) => {
    try {
      console.log(`Attempting to delete product with ID: ${id}`);
      const response = await axios.delete(`http://localhost:3000/api/products/${id}`);
      console.log('Delete response:', response);

      if (response.status === 200 || response.status === 204) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        console.error('Unexpected response:', response);
        alert('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    }
  };

  const DashboardStats = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Total Sales', value: '$54,320', color: 'bg-blue-100' },
          { title: 'Total Orders', value: '342', color: 'bg-green-100' },
          { title: 'Active Products', value: '56', color: 'bg-purple-100' },
          { title: 'Total Revenue', value: '$78,590', color: 'bg-orange-100' }
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-4 rounded-lg shadow-md hover:shadow-lg transition-all`}
          >
            <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
  
    const handleEditProduct = (product) => {
      const completeProduct = {
        ...product,
        id: product._id || product.id,
      };
      setSelectedProduct(completeProduct);
      setIsAddProductOpen(true);
    };
  
    const handleCloseProductModal = () => {
      setIsAddProductOpen(false);
      setSelectedProduct(null);
    };
  
    const handleUpdateProduct = async (updatedProduct) => {
      try {
        if (!updatedProduct) {
          console.error('Updated product is undefined or null');
          return;
        }
  
        const formData = new FormData();
  
        // Add product fields to FormData object
        Object.entries(updatedProduct).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
  
        // Append new images to FormData if any
        if (updatedProduct.images && Array.isArray(updatedProduct.images)) {
          updatedProduct.images.forEach((image) => {
            formData.append('images', image);
          });
        }
  
        const response = await axios.put(`http://localhost:3000/api/products/${updatedProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          // Fetch the updated products after update
          fetchProducts();
          setIsAddProductOpen(false);  // Close the modal
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    const deleteProduct = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:3000/api/products/${id}`);
        if (response.status === 200 || response.status === 204) {
          setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id && product.id !== id));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
  
    const handleAddProduct = async (productData) => {
      try {
        const response = await axios.post('http://localhost:3000/api/products', productData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 201) {
          const newProduct = response.data; // Assuming API responds with the created product
          setProducts((prevProducts) => [...prevProducts, newProduct]); // Add new product to state
          setIsAddProductOpen(false); // Close modal
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    return (
      <div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Product Inventory</h2>
            <button
              onClick={() => {
                setIsAddProductOpen(true);
                setSelectedProduct(null);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
          </div>
  
          <AddProductForm
            isOpen={isAddProductOpen}
            onClose={handleCloseProductModal}
            productId={selectedProduct ? selectedProduct.id : null}
            initialProductData={selectedProduct}
            onUpdate={handleUpdateProduct}
            onAdd={handleAddProduct}
          />
  
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Product Name</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Stock</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Image</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
            </table>
  
            <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
              <table className="w-full table-auto">
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">${product.price}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} width={50} />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-gray-500">
                        No products available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const CustomerManager = () => {
    console.log('Customers state:', customers);
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left border">Name</th>
                <th className="p-3 text-left border">Email</th>
                <th className="p-3 text-left border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">{customer.firstName} {customer.lastName}</td>
                    <td className="p-3 border">{customer.email}</td>
                    <td className="p-3 border">{customer.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };





  const OrderManager = () => {
    const [orders, setOrders] = useState([
      { id: 'ORD001', customer: 'John Doe', total: 1299, status: 'Shipped' },
      { id: 'ORD002', customer: 'Jane Smith', total: 799, status: 'Processing' },
      { id: 'ORD003', customer: 'Mike Johnson', total: 599, status: 'Delivered' }
    ]);

    const updateOrderStatus = (orderId, newStatus) => {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    };

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Order Management</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {['Order ID', 'Customer', 'Total', 'Status', 'Actions'].map((header, index) => (
                <th key={index} className="p-3 text-left text-sm font-medium text-gray-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">${order.total}</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded text-sm 
                    ${order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return (
          <div>
            <DashboardStats />
            <div className="grid md:grid-cols-2 gap-6">
              <ProductManager />
              <OrderManager />
            </div>
          </div>
        );
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrderManager />;
      case 'customers':
        return <CustomerManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
        </div>
        <nav className="p-4">
          {[
            { icon: HomeIcon, text: 'Dashboard', key: 'dashboard' },
            { icon: PackageIcon, text: 'Products', key: 'products' },
            { icon: ShoppingCartIcon, text: 'Orders', key: 'orders' },
            { icon: UsersIcon, text: 'Customers', key: 'customers' },
            { icon: BarChartIcon, text: 'Analytics', key: 'analytics' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveComponent(item.key)}
              className={`
                w-full text-left p-3 rounded flex items-center space-x-3 mb-2
                ${activeComponent === item.key
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
        <div className="border-t p-4 mt-auto">
          {[
            { icon: SettingsIcon, text: 'Settings' },
            { icon: LogoutIcon, text: 'Logout' },
          ].map((item) => (
            <button
              key={item.text}
              className="w-full text-left p-3 rounded flex items-center space-x-3 hover:bg-gray-100 text-gray-700"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>


      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;