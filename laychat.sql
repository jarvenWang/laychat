-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2016-12-25 10:20:43
-- 服务器版本： 5.6.31-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laychat`
--

-- --------------------------------------------------------

--
-- 表的结构 `add_friend_group`
--

CREATE TABLE `add_friend_group` (
  `id` int(10) UNSIGNED NOT NULL COMMENT '主键id',
  `from_uid` varchar(32) NOT NULL COMMENT '谁发起的申请',
  `to_uid` varchar(32) NOT NULL COMMENT '发给谁的申请',
  `to_username` varchar(256) NOT NULL COMMENT '接收者名字',
  `group_id` varchar(32) NOT NULL COMMENT '申请加入的群组(type=group时才有意义)',
  `group_name` varchar(256) NOT NULL COMMENT '群组的名字',
  `type` enum('friend','group') NOT NULL COMMENT '申请类型',
  `remark` varchar(256) NOT NULL COMMENT '申请时附言',
  `agree` tinyint(4) NOT NULL COMMENT '0未处理，1同意，2拒绝',
  `time` int(10) UNSIGNED NOT NULL COMMENT '发起申请时间',
  `user` varchar(1024) NOT NULL COMMENT '发起者的用户信息'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `friends`
--

CREATE TABLE `friends` (
  `uid` varchar(32) NOT NULL COMMENT '用户uid',
  `friend_uid` varchar(32) NOT NULL COMMENT '好友uid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `group`
--

CREATE TABLE `group` (
  `gid` int(10) UNSIGNED NOT NULL COMMENT '群组id',
  `groupname` varchar(64) NOT NULL COMMENT '群组名称',
  `avatar` varchar(256) NOT NULL DEFAULT 'http://tva2.sinaimg.cn/crop.0.0.199.199.180/005Zseqhjw1eplix1brxxj305k05kjrf.jpg' COMMENT '群组图标',
  `creator` varchar(32) NOT NULL COMMENT '创建者',
  `timestamp` int(10) UNSIGNED NOT NULL COMMENT '创建时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `group_members`
--

CREATE TABLE `group_members` (
  `gid` int(11) NOT NULL COMMENT '群组id',
  `uid` varchar(32) NOT NULL COMMENT '用户uid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `hid` int(10) UNSIGNED NOT NULL COMMENT '消息id',
  `from` varchar(32) NOT NULL COMMENT '发起者uid',
  `to` varchar(32) NOT NULL COMMENT '接收者id，根据type不同，可能是用户uid，可能是群组id',
  `data` text NOT NULL COMMENT '具体的消息数据',
  `type` enum('friend','group') DEFAULT NULL,
  `timestamp` int(10) UNSIGNED NOT NULL COMMENT '消息时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `uid` varchar(32) NOT NULL COMMENT '用户uid',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `avatar` varchar(256) NOT NULL COMMENT '头像url',
  `sign` varchar(256) DEFAULT NULL COMMENT '签名',
  `sex` enum('男','女') NOT NULL DEFAULT '男',
  `reg_timestamp` varchar(19) NOT NULL COMMENT '注册日期，暂时没用到',
  `logout_timestamp` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '退出系统时间戳，用于查询离线消息',
  `notice_read_timestamp` int(10) NOT NULL DEFAULT '0' COMMENT '最后读取消息盒子的时间，用于计算未读离线消息盒子中消息数',
  `status` enum('online','offline') NOT NULL DEFAULT 'offline' COMMENT '在线状态，在线或者离线'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `add_friend_group`
--
ALTER TABLE `add_friend_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time` (`time`),
  ADD KEY `time_2` (`time`),
  ADD KEY `from_uid` (`from_uid`),
  ADD KEY `to_uid` (`to_uid`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD UNIQUE KEY `uid1` (`uid`,`friend_uid`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`gid`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD UNIQUE KEY `gid` (`gid`,`uid`),
  ADD UNIQUE KEY `gid_2` (`gid`,`uid`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`hid`),
  ADD KEY `timestamp` (`timestamp`),
  ADD KEY `from` (`from`),
  ADD KEY `to` (`to`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `add_friend_group`
--
ALTER TABLE `add_friend_group`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id', AUTO_INCREMENT=155;
--
-- 使用表AUTO_INCREMENT `group`
--
ALTER TABLE `group`
  MODIFY `gid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '群组id', AUTO_INCREMENT=11;
--
-- 使用表AUTO_INCREMENT `message`
--
ALTER TABLE `message`
  MODIFY `hid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息id', AUTO_INCREMENT=227;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
