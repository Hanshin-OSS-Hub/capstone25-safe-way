# Safeway

Safeway는 **안전한 경로 안내 및 위험 요소 제보 기능**을 제공하는 서비스입니다.

현재 저장소는 Backend / Infra / Mobile / Docs를 하나의 저장소에서 관리하는 **Monorepo 구조**로 구성되어 있습니다.

---

# 1. 프로젝트 구조

```
safeway
│
├─ backend        # Spring Boot 백엔드 서버
│
├─ infra          # Docker 및 DB 인프라 설정
│   ├─ docker-compose.yml
│   └─ postgres
│       └─ init
│           └─ init.sql
│
├─ docs           # 프로젝트 문서
│
└─ mobile         # 모바일 앱 (React Native 예정)
```

---

# 2. 기술 스택

## Backend
- Java 17
- Spring Boot 3.x

## Database
- PostgreSQL 15

## DB 관리
- pgAdmin 4

## Infra
- Docker
- Docker Compose

## Mobile
- React Native (예정)

---

# 3. 실행 전 준비

다음 프로그램이 설치되어 있어야 합니다.

- Git
- Docker Desktop
- JDK 17
- IntelliJ IDEA 또는 VS Code

---

# 4. 프로젝트 실행 방법

## 4.1 저장소 클론

```bash
git clone <REPOSITORY_URL>
cd safeway
```

## 4.2 Docker 인프라 실행

```bash
cd infra
docker compose up -d
```

## 4.3 실행된 컨테이너 확인

```bash
docker compose ps
```

정상 실행 시 다음 컨테이너가 실행됩니다.

- postgres
- pgadmin
- backend (추후 추가)

---

# 5. PostgreSQL 접속 정보

| 항목 | 값 |
|-----|-----|
| DB 이름 | safeway |
| 사용자 | safeway |
| 비밀번호 | REMOVED |
| 포트 | 5432 |

---

# 6. pgAdmin 접속

브라우저에서 접속

```
http://localhost:5050
```

pgAdmin 로그인 정보

| 항목 | 값 |
|-----|-----|
| Email | REMOVED |
| Password | REMOVED |

---

# 7. pgAdmin에서 PostgreSQL 서버 등록

pgAdmin 접속 후 다음 순서로 서버를 등록합니다.

### 1 Servers 우클릭

```
Register → Server
```

### 2️ General 탭

```
Name: safeway-postgres
```

### 3️ Connection 탭

| 항목 | 값 |
|-----|-----|
| Host name | postgres |
| Port | 5432 |
| Maintenance DB | safeway |
| Username | safeway |
| Password | REMOVED |

⚠️ 주의

Docker 내부에서는 `localhost`가 아니라  
**서비스 이름인 `postgres`로 접속해야 합니다.**

---

# 8. 데이터베이스 초기화 방식

DB 초기 테이블은 다음 파일에서 관리합니다.

```
infra/postgres/init/init.sql
```

PostgreSQL 컨테이너가 **처음 생성될 때 자동 실행됩니다.**
Spring Boot가 테이블을 자동 생성하는 구조는 아니며, `spring.jpa.hibernate.ddl-auto=none` 설정이라 `init.sql`이 스키마 생성의 기준입니다.

즉 다음 명령어 실행 시

```bash
docker compose up -d
```

`init.sql`에 작성된 테이블이 자동 생성됩니다.

---

# 9. 데이터베이스 테이블 확인

## 방법 1. pgAdmin

다음 경로로 이동합니다.

```
Servers
 └ PostgreSQL
    └ Databases
       └ safeway
          └ Schemas
             └ public
                └ Tables
```

여기서 생성된 테이블 목록을 확인할 수 있습니다.

---

## 방법 2. 터미널

PostgreSQL 컨테이너 접속

```bash
docker exec -it safeway-postgres psql -U safeway -d safeway
```

테이블 목록 확인

```sql
\dt
```

---

# 10. 데이터 저장 테스트

테이블이 정상 생성되었는지 확인하기 위해 데이터를 삽입할 수 있습니다.

```sql
INSERT INTO users (name) VALUES ('test_user');
```

조회

```sql
SELECT * FROM users;
```

데이터가 조회되면 DB 저장이 정상 작동하는 것입니다.

---

# 11. init.sql이 적용되지 않을 때

PostgreSQL의 `init.sql`은 **DB가 최초 생성될 때만 실행됩니다.**
따라서 컨테이너를 재시작만 하면 다시 실행되지 않고, 스키마를 새로 반영하려면 볼륨까지 지운 뒤 재생성해야 합니다.

이미 DB가 생성된 경우 SQL이 다시 실행되지 않을 수 있습니다.

이 경우 DB를 초기화합니다.

```bash
docker compose down -v
docker compose up -d
```

⚠️ `-v` 옵션은 DB 데이터를 삭제합니다.

---

# 12. Git Pull 후 스키마 반영 문제

Git pull로 `init.sql` 파일은 내려받을 수 있습니다.

하지만 PostgreSQL 내부 DB는 자동 갱신되지 않을 수 있습니다.

이미 생성된 DB 볼륨이 존재하는 경우 변경 사항이 적용되지 않습니다.

이 경우 아래 명령어를 실행합니다.

```bash
docker compose down -v
docker compose up -d
```

---

# 13. 주요 폴더 설명

| 폴더 | 설명 |
|-----|-----|
| backend | Spring Boot API 서버 |
| infra | Docker / PostgreSQL / pgAdmin 환경 |
| docs | 프로젝트 문서 |
| mobile | React Native 모바일 앱 |

---

# 14. Git 관리 주의사항

다음 파일은 Git에 올리지 않습니다.

```
.env
node_modules
build
.gradle
.idea
.vscode
```

개인 환경 설정 및 빌드 파일은 `.gitignore`로 제외합니다.

---

# 15. 향후 개발 계획

- Spring Boot API 구현
- Redis 연동
- JWT 인증 / 인가
- 모바일 앱 개발
- AWS 배포 환경 구축
- DB 마이그레이션 도입 (Flyway / Liquibase)

---

# 16. Git 첫 Push

README 작성 후 다음 순서로 진행합니다.

```bash
git add .
git status
git commit -m "Initial project setup"
git push origin main
```

---

# 17. Push 전 확인 사항

다음 사항을 확인합니다.

- init.sql 테이블 생성 테스트 완료
- docker compose 실행 확인
- pgAdmin 접속 및 DB 확인 완료
- README 실행 방법 작성 완료

---

이 README는 **팀원이 저장소를 처음 받아도 바로 실행할 수 있도록 작성된 문서입니다.**
