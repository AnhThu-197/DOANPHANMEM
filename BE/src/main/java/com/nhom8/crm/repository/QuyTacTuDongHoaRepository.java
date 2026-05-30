package com.nhom8.crm.repository;

import com.nhom8.crm.entity.QuyTacTuDongHoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuyTacTuDongHoaRepository extends JpaRepository<QuyTacTuDongHoa, Integer> {
    List<QuyTacTuDongHoa> findByLoaiQuyTac(String loaiQuyTac);
}
