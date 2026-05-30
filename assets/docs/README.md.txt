1. Portada

Nombre del proyecto:Consultorio Odontológico Virtual
Odontolyt

Integrantes:  

Harvey Santiago Gutierrez Hernandez
1152072

Curso: Programación Web
Fecha: Domingo 12 de abril de 2026 20:20

2. Descripción general del proyecto

El presente proyecto consiste en el desarrollo de una plataforma web integral para la gestión de un consultorio odontológico, orientada a mejorar la eficiencia administrativa y clínica mediante la digitalización de procesos. La solución permitirá a pacientes, odontólogos y personal administrativo interactuar con el sistema a través de una interfaz intuitiva y segura, ofreciendo funcionalidades clave como la gestión de citas, acceso y actualización del historial clínico, y notificaciones automáticas. 

El sistema será implementado utilizando una arquitectura moderna basada en tecnologías de desarrollo web, con React.js en el frontend y Spring Boot en el backend, y una base de datos relacional (MySQL) para almacenamiento de datos. Se priorizará la protección de datos sensibles, cumpliendo con normativas de privacidad y seguridad, y se asegurará la escalabilidad y compatibilidad móvil para facilitar su uso en diferentes dispositivos.
Este proyecto busca optimizar los procesos internos del consultorio, reducir tiempos de gestión, mejorar la experiencia del usuario y garantizar la integridad y confidencialidad de la información clínica, promoviendo una atención más rápida, confiable y eficiente para todos los actores involucrados.
------------------------

Problema que resuelve:La dificultad de agendar citas, consultar historiales y recibir información de manera remota en un consultorio odontológico tradicional.
Contexto:La creciente demanda de servicios digitales en salud y la necesidad de mejorar la atención al paciente, facilitando la gestión de citas y consultas de forma online.

Justificación:Implementar una plataforma digital que optimice la atención, reduzca tiempos y mejore la experiencia del paciente, permitiendo a los profesionales gestionar mejor sus recursos.


3. Enunciado del sistema

Enunciado del sistema
Descripción del sistema:El sistema será una plataforma web integral para la gestión de un consultorio odontológico, diseñada para optimizar los procesos administrativos y clínicos. Permitirá a los usuarios registrarse, autenticarse y gestionar citas, acceder y actualizar historiales clínicos, y recibir notificaciones automáticas. La plataforma deberá integrar funciones de administración para el personal odontológico, facilitando la visualización y gestión de la agenda, la consulta de registros históricos y la generación de reportes. La solución debe ser escalable, segura y compatible con dispositivos móviles, garantizando la protección de datos sensibles conforme a las normativas de privacidad aplicables.

Usuarios objetivo:  

Pacientes: Usuarios que desean agendar citas, consultar su historial clínico y recibir notificaciones. 
 
Odontólogos: Profesionales que gestionan las citas, revisan y actualizan el historial clínico, y administran la agenda.  

Personal administrativo: Encargados de gestionar la información general, coordinar citas y atender consultas.

Alcance:Incluye:  

Registro y autenticación de usuarios (pacientes, odontólogos, administrativos).  
Gestión de citas (programación, modificación, cancelación).  
Visualización y edición del historial clínico del paciente.  
Notificaciones automáticas por email o SMS para recordatorios o cambios.  
Panel administrativo para gestión global del sistema y reportes básicos.

No incluye:  

Funcionalidades de teleconsulta o videollamadas.  
Procesamiento de pagos en línea o integración con sistemas de facturación.  
Gestión avanzada de inventario o stock de materiales.  
Funciones de analítica avanzada o inteligencia artificial.

Este sistema debe cumplir con estándares de seguridad y confidencialidad, garantizando la integridad y protección de la información clínica y personal, y facilitar una interfaz intuitiva que mejore la experiencia del usuario final.

------------------------


4. Actores del sistema
Actor 1:PacienteDescripción: Usuario que solicita servicios odontológicos, agenda citas y consulta información.
Actor 2:Odontólogo / AdministradorDescripción: Personal encargado de gestionar citas, acceder a historiales y administrar la plataforma.

5. Features (Funcionalidades)
Feature 1:Registro y autenticación de usuariosDescripción: Permite a pacientes y odontólogos crear cuentas y acceder al sistema.
Feature 2:Gestión de citasDescripción: Los pacientes pueden agendar, modificar o cancelar citas; los odontólogos pueden visualizar su agenda.
Feature 3:Consulta de historial clínicoDescripción: Los pacientes y odontólogos pueden ver y actualizar el historial médico del paciente.

6. Modelo de datos
Diagrama entidad-relación:(Aquí puedes incluir un diagrama visual en Figma o Stitch)
Entidades principales:  

Usuarios  
Citas  
Historial clínico

Relaciones:  

Usuario tiene muchas citas  
Cita pertenece a un usuario  
Usuario tiene un historial clínico


7. Diseño de la aplicación (UI/UX)
Paleta de colores:Azul (#007BFF), Blanco (#FFFFFF), Gris claro (#F8F9FA)
Tipografía:Roboto, sans-serif
Mockups:(Incluir enlaces a Figma o Stitch)

8. Arquitectura propuesta
Frontend:React.js
Backend:Spring Boot
Base de datos:MySQL
Diagrama de arquitectura:(Incluir diagrama visual de la arquitectura)

9. Endpoints iniciales



Método
Endpoint
Descripción



POST
/auth/register
Registro de usuario


POST
/auth/login
Autenticación de usuario


GET
/appointments
Listar citas del usuario


POST
/appointments
Crear una cita


GET
/medical-history
Consultar historial médico



10. Plan de trabajo
Sprint 1:  

Configuración del entorno y base de datos  
Diseño de modelos y esquemas iniciales  
Implementación del registro y login

Sprint 2:  

Gestión de citas  
Visualización del calendario  
Validaciones y pruebas

Responsables por tarea:  

Juan Pérez: Backend - autenticaciones y citas  
María Gómez: Frontend - UI y mockups  
Carlos López: Integración y pruebas


11. Reglas del proyecto
Uso de GitHub:Repositorio en GitHub con ramas para cada funcionalidad, pull requests para integración.
Uso de React (Frontend):Componentes modulares, buen manejo del estado y responsive design.
Uso de Spring Boot (Backend):API REST estructurada, validaciones y manejo de errores.
API REST obligatoria:Sí, se desarrollará una API REST para todas las operaciones CRUD.


Definición del modelo de datos.

Definición del modelo de datos
El modelo de datos del sistema está diseñado para gestionar la información esencial del consultorio odontológico, estructurando las entidades principales y sus relaciones para garantizar la integridad, consistencia y disponibilidad de la información.
Entidades principales

Usuario  

ID_usuario (PK)  
nombre  
apellido  
tipo_usuario (paciente, odontólogo, administrativo)  
email  
contraseña (hash)  
teléfono  
dirección


Paciente (extiende Usuario)  

ID_paciente (PK, FK a Usuario)  
fecha_nacimiento  
género  
historial_clinico (relación con HistorialClinico)


Odontólogo (extiende Usuario)  

ID_odontologo (PK, FK a Usuario)  
especialidad  
licencia_profesional


Cita  

ID_cita (PK)  
fecha_hora  
estado (programada, cancelada, finalizada)  
FK_odontologo (FK a Odontólogo)  
FK_paciente (FK a Paciente)


HistorialClinico  

ID_historial (PK)  
FK_paciente (FK a Paciente)  
descripción  
tratamientos_realizados  
fecha_actualización


Notificación  

ID_notificación (PK)  
FK_usuario (FK a Usuario)  
tipo (recordatorio, aviso)  
mensaje  
fecha_envio  
estado (enviado, pendiente)



Relaciones clave

Un Paciente puede tener múltiples HistorialClinico (uno a muchos).  
Un Odontólogo puede atender múltiples Citas (uno a muchos).  
Una Cita está relacionada con un Paciente y un Odontólogo.  
Un Usuario puede recibir múltiples Notificaciones.

Consideraciones adicionales

La estructura permitirá búsquedas eficientes por usuario, fecha de cita, o estado del tratamiento.  
La normalización del modelo evitará redundancias y facilitará la escalabilidad futura.  
Se implementarán mecanismos de seguridad para proteger los datos sensibles, especialmente en las entidades que contienen información clínica y personal.