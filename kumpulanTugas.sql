SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `kumpulanTugas` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `kumpulanTugas`;

DROP TABLE IF EXISTS `tugas`;
CREATE TABLE `tugas` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `matkul` varchar(255) NOT NULL,
  `dosen` varchar(255) NOT NULL,
  `jenis_tugas` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `deskripsi` text ,
  `tanggal_pengumpulan` datetime ,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL


) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `tugas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;