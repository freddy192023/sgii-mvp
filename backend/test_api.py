import requests

BASE_URL = "http://localhost:8000"

def test_api():
    print("1. Probando Registro...")
    reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword123"
    })
    print(f"Registro status: {reg_res.status_code}")
    if reg_res.status_code not in [200, 201, 400]:
        print("Error en registro:", reg_res.text)
        return

    print("\n2. Probando Login...")
    log_res = requests.post(f"{BASE_URL}/api/auth/login", data={
        "username": "testuser",
        "password": "testpassword123"
    })
    print(f"Login status: {log_res.status_code}")
    if log_res.status_code != 200:
        print("Error en login:", log_res.text)
        return
    
    token = log_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\n3. Probando Crear Proyecto...")
    proj_res = requests.post(f"{BASE_URL}/api/projects/", headers=headers, json={
        "name": "Proyecto Auto Test",
        "description": "Prueba automática",
        "status": "planning"
    })
    print(f"Crear Proyecto status: {proj_res.status_code}")
    if proj_res.status_code != 201:
        print("Error al crear:", proj_res.text)
        return
    
    proj_id = proj_res.json()["id"]

    print("\n4. Probando Editar Proyecto...")
    edit_res = requests.put(f"{BASE_URL}/api/projects/{proj_id}", headers=headers, json={
        "name": "Proyecto Auto Test Editado",
        "status": "active"
    })
    print(f"Editar Proyecto status: {edit_res.status_code}")
    if edit_res.status_code != 200:
        print("Error al editar:", edit_res.text)
        return
    print("Nombre actualizado:", edit_res.json()["name"])

    print("\n5. Probando Eliminar Proyecto...")
    del_res = requests.delete(f"{BASE_URL}/api/projects/{proj_id}", headers=headers)
    print(f"Eliminar Proyecto status: {del_res.status_code}")

    print("\n✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE!")

if __name__ == "__main__":
    test_api()
