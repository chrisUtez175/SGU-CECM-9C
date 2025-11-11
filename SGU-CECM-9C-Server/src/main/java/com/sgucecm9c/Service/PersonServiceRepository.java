package com.sgucecm9c.Service;

import com.sgucecm9c.Entity.PersonEntity;
import com.sgucecm9c.utils.Message;
import org.springframework.http.ResponseEntity;

public interface PersonServiceRepository {
    public ResponseEntity<Message> guardarPersona(PersonEntity person);
    public ResponseEntity<Message> listarPersona();
    public ResponseEntity<Message> obtenerPersonaBYID(Long id);
    public ResponseEntity<Message> updatePersona(PersonEntity person);
    public ResponseEntity<Message> actualizarEstatus(Long id);
}
