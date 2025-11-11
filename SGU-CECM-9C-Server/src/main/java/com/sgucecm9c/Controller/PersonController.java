package com.sgucecm9c.Controller;

import com.sgucecm9c.Entity.PersonEntity;
import com.sgucecm9c.Service.PersonService;
import com.sgucecm9c.Service.PersonServiceRepository;
import com.sgucecm9c.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping ("/person")
@CrossOrigin(origins = "*")

public class PersonController {
    private final PersonServiceRepository  personServiceRepository;
    @Autowired
    public PersonController(PersonServiceRepository personServiceRepository) {
        this.personServiceRepository = personServiceRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<Message> guardarPersona( @RequestBody PersonEntity person) {
        return personServiceRepository.guardarPersona(person);
    }

    @GetMapping("/listAll")
    public ResponseEntity<Message> listarPersona(){
        return personServiceRepository.listarPersona();
    }

    @PutMapping("/updatePerson")
    public ResponseEntity<Message> actualizarPersona( @RequestBody  PersonEntity person) {
        return 	personServiceRepository.updatePersona(person);
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<Message> actualizarEstatus(@PathVariable long id) {
        return personServiceRepository.actualizarEstatus(id);
    }

    @GetMapping("/findBy/{id}")
    public ResponseEntity<Message> obtenerPersonaById(@PathVariable Long id){
        return personServiceRepository.obtenerPersonaBYID(id);
    }
}
