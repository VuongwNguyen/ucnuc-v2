import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Úc Núc
              </h2>
              <p className="text-lg text-gray-600 max-w-xs">
                Nơi hương vị truyền thống gặp gỡ sự sáng tạo hiện đại
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick links
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900">Khám phá</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Thực đơn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Khuyến mãi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tin tức
                </a>
              </li>
            </ul>
          </motion.div> */}

          {/* Contact info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-gray-600 group-hover:text-primary transition-colors">
                  123 Đường ABC, Quận XYZ, TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-gray-600 group-hover:text-primary transition-colors">
                  (028) 1234 5678
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-gray-600 group-hover:text-primary transition-colors">
                  contact@ucnuc.com
                </span>
              </div>
            </div>
          </motion.div>

          {/* Opening hours */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gray-50">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              Giờ mở cửa
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                <span className="text-gray-600">Thứ 2 - Thứ 6</span>
                <span className="font-medium text-primary">7:00 - 22:00</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                <span className="text-gray-600">Thứ 7 - CN</span>
                <span className="font-medium text-primary">8:00 - 23:00</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500">
              &copy; {currentYear} Úc Núc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 