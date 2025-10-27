export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
  category: string;
  tags: string;
  created_at: string;
  updated_at?: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our latest noise-cancelling technology. Perfect for music lovers and professionals.",
    price: 199.99,
    discount_price: 149.99,
    is_active: true,
    is_featured: true,
    image_url: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electronics",
    tags: "audio, wireless, headphones",
    created_at: "2023-10-27T10:00:00Z",
  },
  {
    id: 2,
    title: "Ergonomic Office Chair",
    description: "Support your posture and work comfortably all day with our fully adjustable ergonomic chair.",
    price: 350.00,
    is_active: true,
    is_featured: false,
    image_url: "https://images.pexels.com/photos/1020314/pexels-photo-1020314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Furniture",
    tags: "office, chair, ergonomic",
    created_at: "2023-10-26T12:30:00Z",
  },
  {
    id: 3,
    title: "Minimalist Leather Wallet",
    description: "A slim, stylish wallet made from genuine leather. Holds all your essentials without the bulk.",
    price: 59.50,
    is_active: true,
    is_featured: true,
    image_url: "https://images.pexels.com/photos/291862/pexels-photo-291862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories",
    tags: "wallet, leather, minimalist",
    created_at: "2023-10-25T09:00:00Z",
  },
  {
    id: 4,
    title: "Smart Home Hub",
    description: "Control all your smart devices from one central hub. Compatible with major brands.",
    price: 99.00,
    is_active: true,
    is_featured: false,
    image_url: "https://images.pexels.com/photos/714699/pexels-photo-714699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electronics",
    tags: "smart home, hub, iot",
    created_at: "2023-10-24T15:45:00Z",
  },
  {
    id: 5,
    title: "Organic Coffee Beans (1kg)",
    description: "Rich, aromatic coffee beans sourced from sustainable farms. Perfect for your morning brew.",
    price: 25.00,
    is_active: true,
    is_featured: false,
    image_url: "https://images.pexels.com/photos/892919/pexels-photo-892919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Groceries",
    tags: "coffee, organic, beans",
    created_at: "2023-10-23T08:00:00Z",
  },
  {
    id: 6,
    title: "Stainless Steel Water Bottle",
    description: "Keep your drinks cold for 24 hours or hot for 12 hours. Eco-friendly and durable.",
    price: 30.00,
    discount_price: 24.00,
    is_active: true,
    is_featured: true,
    image_url: "https://images.pexels.com/photos/416722/pexels-photo-416722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Lifestyle",
    tags: "bottle, steel, water",
    created_at: "2023-10-22T11:20:00Z",
  },
  {
    id: 7,
    title: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with customizable keys. Built for gamers and typists who demand precision.",
    price: 129.99,
    is_active: true,
    is_featured: true,
    image_url: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electronics",
    tags: "keyboard, gaming, mechanical",
    created_at: "2023-10-21T14:00:00Z",
  },
  {
    id: 8,
    title: "Yoga Mat - Premium Quality",
    description: "Non-slip, eco-friendly yoga mat with extra cushioning. Perfect for all types of exercises and meditation.",
    price: 45.00,
    discount_price: 35.00,
    is_active: true,
    is_featured: false,
    image_url: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Sports",
    tags: "yoga, mat, fitness",
    created_at: "2023-10-20T10:30:00Z",
  },
];
