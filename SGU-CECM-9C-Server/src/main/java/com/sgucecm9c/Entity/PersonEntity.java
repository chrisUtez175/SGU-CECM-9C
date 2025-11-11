package com.sgucecm9c.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "person")
public class PersonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre" , nullable = false , length = 255)
    String nombreCompleto;

    @Column(name = "correo" , nullable = false , length = 255)
    String  correo;

    @Column(name = "telefono" , nullable = false , length = 255)
    String  telefono;

    @Column(name = "estado", nullable = false ,columnDefinition = "BOOL ")
    private boolean estado;

    public PersonEntity() {
    }

    public PersonEntity(String nombreCompleto, String correo, String telefono, boolean estado) {
        this.nombreCompleto = nombreCompleto;
        this.correo = correo;
        this.telefono = telefono;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "PersonEntity{" +
                "id=" + id +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", correo='" + correo + '\'' +
                ", telefono='" + telefono + '\'' +
                ", estado=" + estado +
                '}';
    }
}
