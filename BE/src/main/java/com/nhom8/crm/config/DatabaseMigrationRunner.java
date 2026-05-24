package com.nhom8.crm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("==================================================");
        System.out.println("Running database migration for CauHinhHeThong columns...");
        try {
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN tenCongTy NVARCHAR(200)");
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN diaChiCongTy NVARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN muiGio NVARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN donViTienTe NVARCHAR(20)");
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN ngonNgu NVARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE CauHinhHeThong ALTER COLUMN tanSuatSaoLuu NVARCHAR(50)");
            System.out.println("✓ Database migration: altered columns to NVARCHAR successfully!");
        } catch (Exception e) {
            System.err.println("⚠ Database migration failed/ignored: " + e.getMessage());
        }
        System.out.println("==================================================");
    }
}
