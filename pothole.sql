-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2026 at 05:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pothole`
--

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `complaintid` int(11) NOT NULL,
  `complaint_date` datetime DEFAULT NULL,
  `complaint_desc` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`complaintid`, `complaint_date`, `complaint_desc`, `location`, `picture`, `userid`, `status`) VALUES
(1, '2026-02-17 06:38:21', 'aa', 'https://www.google.com/maps/place/Nice+Kanakpura+Road+Toll+Booth/@12.8598784,77.5196426,16z/data=!4m15!1m8!3m7!1s0x3bae40b40b4994b1:0x1014fda5c28fb69d!2sKamiahnapalya,+Karnataka+560074!3b1!8m2!3d12.8538508!4d77.4745262!16s%2Fg%2F11h4zq2qd6!3m5!1s0x3bae406', '1771310314315.jpg', 34, 'reslove'),
(2, '2026-02-18 07:10:05', 'road is not good', 'https://www.google.com/maps/place/Peenya+Metro+Station+parking/@13.0331318,77.5291399,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3d00582140bd:0x1b98c9583a8b81c2!8m2!3d13.0331266!4d77.5337533!16s%2Fg%2F11wjb0rvvn?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D', '1771398652900.jpg', 35, 'Pending'),
(3, '2026-02-18 07:25:54', 'road damage', 'https://www.google.com/maps/place/Leggere+Rd,+Yeshwanthpur+Suburb+II+Stage,+Peenya,+Bengaluru,+Karnataka+560058/@13.0333978,77.5247885,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3d22a440923f:0xb5bdc74ec1ed52bb!8m2!3d13.0333926!4d77.5273634!16s%2Fg%2F1ydp7fhdr?entr', '1771399599874.jpg', 35, 'In Progress'),
(4, '2026-02-19 05:30:57', 'heavy traffic', 'https://www.google.com/maps/place/Summanahalli/@12.9865222,77.5189321,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3db5ed73db55:0xe407e48343db9c36!8m2!3d12.986517!4d77.521507!16s%2Fg%2F1tffscgg?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D', '1771479158457.jpg', 36, 'Pending'),
(5, '2026-02-19 05:41:36', 'road is not good', 'https://www.google.com/maps/place/Sukandakatte/@12.9919374,77.5038165,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3d0011a7f525:0x2c0cb5757dd7ffc9!8m2!3d12.9919322!4d77.5063914!16s%2Fg%2F11m68x9h0y?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D', '1771479748476.jpg', 37, 'Pending'),
(6, '2026-02-19 05:46:10', 'more potholes', 'https://www.google.com/maps/place/2H7P%2BVCX+Mekhri+Circle,+12,+Ganganagar,+Bengaluru,+Karnataka+560006/@13.0148804,77.5835502,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae17b59e3262e9:0xa9d3c93c00651a47!8m2!3d13.0148752!4d77.5861251!16s%2Fg%2F11w7r2py9m?entry=ttu&g', '1771480086506.jpg', 38, 'Resolved'),
(7, '2026-02-19 05:51:55', 'potholes', 'https://www.google.com/maps/place/Yelenahalli/@12.861624,77.6111249,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b00300a9827:0x61c97fcac556b7c6!8m2!3d12.8616188!4d77.6136998!16s%2Fg%2F11wwq1vhth?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D', '1771480403225.jpg', 40, 'Pending'),
(8, '2026-02-20 03:51:42', 'more pothole', 'https://www.google.com/maps/place/Mahalakshmi+layout/@13.0102213,77.5485299,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3dc5f27f64c3:0x4ea9ec8e25d11877!8m2!3d13.0102161!4d77.5511048!16s%2Fg%2F11v3kf4f68?entry=ttu&g_ep=EgoyMDI2MDIxNy4wIKXMDSoASAFQAw%3D%3D', '1771559606110.jpg', 32, 'Resolved'),
(9, '2026-02-20 03:51:42', 'more pothole', 'https://www.google.com/maps/place/Mahalakshmi+layout/@13.0102213,77.5485299,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3dc5f27f64c3:0x4ea9ec8e25d11877!8m2!3d13.0102161!4d77.5511048!16s%2Fg%2F11v3kf4f68?entry=ttu&g_ep=EgoyMDI2MDIxNy4wIKXMDSoASAFQAw%3D%3D', '1771559607164.jpg', 32, 'In Progress'),
(10, '2026-02-23 04:35:42', 'My new complaint', 'https://www.google.com/maps/place/Nice+Kanakpura+Road+Toll+Booth/@12.8598784,77.5196426,16z/data=!4m15!1m8!3m7!1s0x3bae40b40b4994b1:0x1014fda5c28fb69d!2sKamiahnapalya,+Karnataka+560074!3b1!8m2!3d12.8538508!4d77.4745262!16s%2Fg%2F11h4zq2qd6!3m5!1s0x3bae406', '1771821342045.jpg', 41, 'In Progress');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `feedback` text NOT NULL,
  `is_registered` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `phone`, `feedback`, `is_registered`, `created_at`) VALUES
(2, 'Teju', 'teju25@gmail.com', '6565656552', 'Good response', 1, '2026-02-17 06:46:29'),
(3, 'Teju', 'teju25@gmail.com', '6565656552', 'good service', 1, '2026-02-23 05:56:52'),
(4, 'Hemith', 'hemithj@gmail.com', '2222222222', 'it is good\n', 1, '2026-02-25 06:04:57'),
(5, 'Hemith', 'hemithj@gmail.com', '2222222222', 'gdfgdgdgdgdfgdfgfgg', 1, '2026-02-25 06:11:03');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('customer','staff','admin') DEFAULT 'customer',
  `phone` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(1, 'admin', 'admin@potholes.com', '$2a$10$zBHG30kustvpn0FVIZ1Cx.uO.L/gRovsXoECIM.cQHit/5duNLBky', 'admin', '0', '0000-00-00 00:00:00'),
(32, 'Teju', 'teju25@gmail.com', '$2a$10$afAu2r5wSC9XVFT06STTuO8Hf95p7kldGw4nxoW9OzpJvZlc69Fg6', '', '6565656552', '2026-02-17 05:27:16'),
(33, 'indra', 'indra23@gmail.com', '$2a$10$H3DXK/z68DhrMYwKUpGVvurmDIe5MfzL8WagRFR6FxAGuVbjcrr7a', '', '5466563644', '2026-02-17 05:54:57'),
(34, 'aruna', 'aruna32@gmail.com', '$2a$10$cLpwrJxFxR7gSKe35qu26u5IzCYYOtKfz/bfc3NhXFk0ctb34bLf.', '', '8569471237', '2026-02-17 05:56:52'),
(35, 'mohan', 'mohangmoni8@gmail.com', '$2a$10$QHhZ5Viuh1cKRAIZ0z1NouPnJdSJdPGzTiO0KXuxopI6eAEUreKdi', '', '9844166160', '2026-02-18 07:09:43'),
(36, 'praveen', 'praveenpraveenyt30@gamil.com', '$2a$10$Edmo9PSdbsNC7sb9bTpQF.TQh6JQggj/N8bnLYTlb9Ei2L9CuWy7W', '', '9535891529', '2026-02-19 05:30:31'),
(37, 'ravi', 'ravi63@gamil.com', '$2a$10$lGvVrdsR4G6SoiJZvRr1Ruc4sOuAi.a.cdh2Qnqc8efB9oAMMgBLu', '', '6565656552', '2026-02-19 05:41:16'),
(38, 'adhi52', 'adhi52@gmail.com', '$2a$10$7Q6WH9rwWF4mqNFCUrK0Nes96g5jcBI1.CFcACbYQiYylQRRqUmge', '', '5466563644', '2026-02-19 05:44:59'),
(39, 'chai8080', 'chai8080@gmail.com', '$2a$10$VN.DIcj4E5a1gAST4.PthuENgPTL3y4bKG.6DEHihF7KPQ3tEoNim', '', '8569471237', '2026-02-19 05:49:38'),
(40, 'Raki90', 'Raki90@gmail.com', '$2a$10$5q5Le8H.OvzVrV2doCu02uO5tNTiSbN1wNsNEc8..GmAg4qJvBKPi', '', '9844166160', '2026-02-19 05:51:37'),
(41, 'Hemith', 'hemithj@gmail.com', '$2a$10$KIft36Gejdc3umedZaglcuF1AV/gEG/ivOqWxgUBK5yv7Qu31iuPC', '', '2222222222', '2026-02-23 04:31:22'),
(42, 'Bhuvanesh', 'bhuvaneshn946@gmail.com', '$2a$10$.KoyB/Eb8Uco2D2FCAqbMOX5z3UbL/Dyt..sxLYv2NJQjG4y8RzRS', '', '3434343434', '2026-02-23 05:15:06'),
(43, 'staff', 'staff26@gmail.com', '$2a$10$BWh4YVjf9cX2bRPIE3JeceBVk.Fa8fZSpuE.oqhK2mXPqDJrSByIi', 'staff', '8080963451', '2026-02-26 04:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_messages`
--

CREATE TABLE `user_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sender` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_messages`
--

INSERT INTO `user_messages` (`id`, `name`, `email`, `message`, `user_id`, `sender`, `created_at`) VALUES
(24, 'Teju', 'teju25@gmail.com', 'Hello admin!', NULL, 'user', '2026-02-20 05:50:07'),
(25, 'Teju', 'teju25@gmail.com', 'Hello!', NULL, 'user', '2026-02-20 05:52:37'),
(26, 'Teju', 'teju25@gmail.com', 'more potholes in Kamakshipalya', NULL, 'user', '2026-02-20 05:54:34'),
(27, 'Admin', 'teju25@gmail.com', 'it will clear soon', NULL, 'admin', '2026-02-24 05:26:34'),
(28, 'Admin', 'teju25@gmail.com', 'hello', NULL, 'admin', '2026-02-25 05:07:55'),
(29, 'Admin', 'teju25@gmail.com', 'hello1', NULL, 'admin', '2026-02-25 05:08:07'),
(30, 'chaithra', 'chai8080@gmail.com', 'hello admin\n', NULL, 'user', '2026-03-03 06:18:24'),
(31, 'Admin', 'chai8080@gmail.com', 'hello\n', NULL, 'admin', '2026-03-11 05:26:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`complaintid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_messages`
--
ALTER TABLE `user_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_messages_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `complaintid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `user_messages`
--
ALTER TABLE `user_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_messages`
--
ALTER TABLE `user_messages`
  ADD CONSTRAINT `fk_user_messages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
