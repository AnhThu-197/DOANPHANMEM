package com.nhom8.crm.service;

import com.nhom8.crm.dto.request.InteractionRequest;
import com.nhom8.crm.dto.response.InteractionResponse;
import java.util.List;

public interface LichSuTuongTacService {
    List<InteractionResponse> getAllInteractions();
    List<InteractionResponse> getInteractionsByCustomerId(Integer customerId);
    InteractionResponse addInteraction(InteractionRequest request);
}
