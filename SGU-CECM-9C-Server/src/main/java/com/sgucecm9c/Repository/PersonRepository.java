package com.sgucecm9c.Repository;

import com.sgucecm9c.Entity.PersonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository  extends JpaRepository<PersonEntity,Long>{
}
