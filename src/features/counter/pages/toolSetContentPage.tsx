import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

const ToolSetContentPage: React.FC = () => {
    return (
        <div className="wrp-content" ms-root-append="true">
            <header className="header" ms-template-blank="true" ms-role-template="list">
                <div className="header__top" ms-role-template="item">
                    <a href="/" className="header__logo">
                        <img src="https://static.mediacdn.vn/landing/ld8/ld8/hlogo.png" alt="Logo" />
                    </a>
                    <div className="header__action flex items-center gap-2">
                        <Link to={ROUTES.IMPORT_LANDING_PAGE} className="item flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Chọn mẫu Landing Page
                        </Link>
                        <a href="#" className="item"><span className="icon">...</span></a>
                    </div>
                </div>
            </header>

            {/* Banner/Notice */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Bạn muốn thay đổi mẫu thiết kế?</h2>
                        <p className="text-primary-100 mt-1 text-sm">
                            Hãy tải lên file HTML riêng, dán đoạn mã nguồn, hoặc nhập liên kết URL để bắt đầu chỉnh sửa giao diện của bạn.
                        </p>
                    </div>
                    <Link to={ROUTES.IMPORT_LANDING_PAGE} className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-5 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 text-sm whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Chọn mẫu ngay
                    </Link>
                </div>
            </div>

            <section className="box__section box-focus" ms-role-template="list">
                <div ms-role-template="item">
                    <div className="box-images">
                        <img src="https://minisiteb.qltns.mediacdn.vn/minisite/story-text-tren-anh-kem-noidung/./images/i1.png" alt="Lexus LX 600" />
                    </div>
                    <div className="box-content">
                        <p className="title">Lexus lx 600</p>
                        <p className="sapo">Xứng tầm SUV đỉnh cao nhờ giá trị khác biệt</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="box__section section-text" ms-role-template="list">
                <div className="w680">
                    <div className="text-box">
                        <div className="text">
                            Tính đến tháng 8.2021, Lexus đã bán ra thị trường khoảng 500.000 xe LX tại hơn 50 quốc gia...
                            <br /><br />
                            Sức hút khó tin của LX không thể có được trong một sớm một chiều.
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Box */}
            <section className="box__section box-sticky" ms-role-template="list">
                <div ms-role-template="item">
                    <div className="box-image">
                        <img src="https://minisiteb.qltns.mediacdn.vn/minisite/story-text-tren-anh-kem-noidung/./images/i2.png" alt="LX 600" />
                    </div>
                    <div className="box-layout-text" ms-role-template="group">
                        <div className="box-item-point" ms-role-template="item-group">
                            <div className="box-bg">
                                <div className="text">
                                    Lexus LX 600 dễ được mến mộ vì giá bán ngang một căn biệt thự...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ToolSetContentPage;