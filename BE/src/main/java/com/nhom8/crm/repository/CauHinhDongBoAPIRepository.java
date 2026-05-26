package com.nhom8.crm.repository;

import com.nhom8.crm.entity.CauHinhDongBoAPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CauHinhDongBoAPIRepository extends JpaRepository<CauHinhDongBoAPI, Integer> {

    Optional<CauHinhDongBoAPI> findByLoaiNenTang(String loaiNenTang);
}