# HU-001

## Título
Inicio de sesión con nombre de usuario

## Descripción
Como usuario registrado,
quiero ingresar mi nombre de usuario y contraseña en la pantalla de inicio de sesión,
para acceder a mi cuenta y utilizar la plataforma.

## Criterios de aceptación
- CA-01: Acceso correcto: Al ingresar el nombre de usuario y la contraseña registrados y pulsar "Login", el sistema valida los datos y redirige a la pantalla principal (dashboard).
- CA-02: Credenciales incorrectas: Si el nombre de usuario o la contraseña no coinciden con los registros, el sistema muestra el mensaje "Invalid credentials" y deja vacíos los campos de usuario y contraseña.
- CA-03: Campos obligatorios: Si alguno de los dos campos (nombre de usuario o contraseña) está vacío o contiene solo espacios al pulsar "Login", el sistema no procesa el envío y muestra el mensaje "Required" debajo de cada campo vacío.
- CA-04: Mayúsculas y espacios: El sistema reconoce el nombre de usuario sin distinguir entre mayúsculas y minúsculas, mientras que la contraseña sí respeta la distinción. No se recortan los espacios al inicio o al final de ninguno de los dos campos.
- CA-05: Contraseña oculta: El campo de contraseña muestra los caracteres ocultos por defecto.
- CA-06: Sin bloqueo por intentos: No existe límite de intentos fallidos; después de cualquier cantidad de intentos fallidos, el usuario puede iniciar sesión con sus credenciales correctas.
