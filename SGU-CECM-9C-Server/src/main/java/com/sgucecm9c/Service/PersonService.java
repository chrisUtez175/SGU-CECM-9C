package com.sgucecm9c.Service;

import com.sgucecm9c.Entity.PersonEntity;
import com.sgucecm9c.Repository.PersonRepository;
import com.sgucecm9c.utils.Message;
import com.sgucecm9c.utils.TypesResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService  implements PersonServiceRepository {

    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }


    @Override
    public ResponseEntity<Message> guardarPersona(PersonEntity person) {
        PersonEntity savePerson = person;
        savePerson.setEstado(true);
        PersonEntity personEntity = personRepository.saveAndFlush(savePerson);

        if(personEntity == null){
            return new ResponseEntity<>(new Message("la persona no se ha registrado", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(personEntity,"se ha registrado correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Message> listarPersona() {
        List<PersonEntity> listaPerson = personRepository.findAll();
        return new ResponseEntity<>(new Message(listaPerson,"listado de personas", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Message> obtenerPersonaBYID(Long id) {
        Optional<PersonEntity> listaPersonID = personRepository.findById(id);

        if(listaPersonID.isPresent()){
            return new ResponseEntity<>(new Message(listaPersonID,"listado de personas por id", TypesResponse.SUCCESS), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new Message("listado de personas por id", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);

        }
    }

    @Override
    public ResponseEntity<Message> updatePersona(PersonEntity person) {
        PersonEntity savePerson = person;
        savePerson.setEstado(true);
        PersonEntity personEntity = personRepository.saveAndFlush(person);

        if(personEntity == null){
            return new ResponseEntity<>(new Message("la persona no se ha actualizado", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new Message(personEntity,"se ha actualizado correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Message> actualizarEstatus(Long id) {
        Optional<PersonEntity> listpersonOptional = personRepository.findById(id);
        if(listpersonOptional.isPresent()) {
            PersonEntity personEntity = listpersonOptional.get();
            personEntity.setEstado(false);
            personEntity =  personRepository.saveAndFlush(personEntity);
            return new ResponseEntity<>(new Message(personEntity, "La persona se actualizó correctamente", TypesResponse.SUCCESS), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new Message("La persona248  no se actualizaron correctamente", TypesResponse.WARNING), HttpStatus.BAD_REQUEST);
        }
    }
}
