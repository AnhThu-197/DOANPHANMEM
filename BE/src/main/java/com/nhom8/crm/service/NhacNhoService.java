package com.nhom8.crm.service;

import com.nhom8.crm.dto.request.AppointmentRequest;
import com.nhom8.crm.dto.request.AppointmentResultRequest;
import com.nhom8.crm.dto.response.AppointmentResponse;

import java.util.List;

public interface NhacNhoService {
    AppointmentResponse createAppointment(AppointmentRequest request);
    List<AppointmentResponse> getAllAppointments();
    List<AppointmentResponse> getAppointmentsByCustomerId(Integer customerId);
    List<AppointmentResponse> getAppointmentsByEmployeeId(Integer employeeId);
    AppointmentResponse getAppointmentById(Integer id);
    AppointmentResponse updateAppointment(Integer id, AppointmentRequest request);
    AppointmentResponse updateAppointmentResult(Integer id, AppointmentResultRequest request);
    void deleteAppointment(Integer id);
}
