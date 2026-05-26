package com.nhom8.crm.repository;

import com.nhom8.crm.entity.LichSuDongBoAPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuDongBoAPIRepository extends JpaRepository<LichSuDongBoAPI, Integer> {

    List<LichSuDongBoAPI> findTop20ByOrderByThoiGianDesc();
}