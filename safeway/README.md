Safeway

Safeway는 안전한 경로 안내 및 제보 기능을 목표로 하는 프로젝트입니다.
현재 저장소는 Backend / Infra / Mobile / Docs를 하나의 저장소에서 관리하는 monorepo 구조로 구성되어 있습니다.

1. 프로젝트 구조
   safeway
   │
   ├─ backend # Spring Boot 백엔드 서버
   │
   ├─ infra # Docker 및 DB 인프라 설정
   │ ├─ docker-compose.yml
   │ └─ postgres
   │ └─ init
   │ └─ init.sql # DB 초기 테이블 생성 SQL
   │
   ├─ docs # 프로젝트 문서
   │
   └─ mobile # 모바일 앱 (React Native 예정)
2. 사용 기술

Backend

Java 17

Spring Boot 3.x

Database

PostgreSQL 15

DB 관리

pgAdmin 4

Infra

Docker

Docker Compose

Mobile

React Native (예정)

3. 실행 전 준비

다음 프로그램이 설치되어 있어야 합니다.

Git

Docker Desktop

JDK 17

IntelliJ IDEA 또는 VS Code

4. 프로젝트 실행 방법
   4.1 저장소 클론
   git clone <REPOSITORY_URL>
   cd safeway
   4.2 Docker 인프라 실행

infra 폴더로 이동 후 실행합니다.

cd infra
docker compose up -d
4.3 실행된 컨테이너 확인
docker compose ps

정상 실행 시 다음 컨테이너가 실행됩니다.

postgres

pgadmin

backend (추후)

5. PostgreSQL 접속 정보

현재 개발용 PostgreSQL 설정은 docker-compose 내부에 작성되어 있습니다.

DB 이름

safeway

사용자

safeway

비밀번호

REMOVED

포트

5432 6. pgAdmin 접속 방법

브라우저에서 접속

http://localhost:5050

pgAdmin 로그인 계정

Email

REMOVED

Password

REMOVED4 7. pgAdmin에서 PostgreSQL 서버 등록

pgAdmin 접속 후 아래 순서로 서버를 등록합니다.

좌측 메뉴

Servers

우클릭 후

Register → Server
General 탭

Name

safeway-postgres
Connection 탭

Host name / address

postgres

Port

5432

Maintenance database

safeway

Username

safeway

Password

REMOVED

주의

Docker 내부에서는 localhost가 아니라
서비스 이름인 postgres로 접속해야 합니다

8. 데이터베이스 초기화 방식

DB 초기 테이블은 다음 파일에서 관리합니다.

infra/postgres/init/init.sql

PostgreSQL 컨테이너가 처음 생성될 때 자동 실행됩니다.

즉

docker compose up -d

실행 시 init.sql에 작성된 테이블이 자동 생성됩니다.

9. 데이터베이스 테이블 확인 방법
   방법 1. pgAdmin에서 확인

다음 경로로 이동합니다.

Servers
└ PostgreSQL
└ Databases
└ safeway
└ Schemas
└ public
└ Tables

여기서 생성된 테이블 목록을 확인할 수 있습니다.

방법 2. 터미널에서 확인

PostgreSQL 컨테이너 접속

docker exec -it safeway-postgres psql -U safeway -d safeway

테이블 목록 확인

\dt 10. 데이터 저장 테스트

테이블이 정상 생성되었는지 확인하기 위해
직접 데이터를 삽입해볼 수 있습니다.

예시

INSERT INTO users (name) VALUES ('test_user');

조회

SELECT \* FROM users;

데이터가 조회되면 DB 저장이 정상적으로 작동하는 것입니다.

11. init.sql이 적용되지 않을 때

PostgreSQL의 init.sql은 DB가 최초 생성될 때만 실행됩니다.

이미 DB가 생성된 경우 SQL이 다시 실행되지 않을 수 있습니다.

이 경우 아래 명령어로 DB를 초기화 후 다시 실행합니다.

docker compose down -v
docker compose up -d

주의

-v 옵션은 DB 데이터를 삭제합니다. 12. Git pull 후 스키마 반영 문제

Git pull로 init.sql 파일은 내려받을 수 있습니다.

하지만 PostgreSQL 내부 DB는 자동 갱신되지 않을 수 있습니다.

이미 생성된 DB 볼륨이 존재하는 경우
init.sql 변경 내용이 적용되지 않을 수 있습니다.

이 경우 아래 명령어를 사용합니다.

docker compose down -v
docker compose up -d 13. 주요 폴더 설명

backend
Spring Boot 기반 API 서버

infra
Docker, PostgreSQL, pgAdmin 등 실행 환경 관리

docs
프로젝트 문서 및 설계 자료

mobile
React Native 모바일 앱 (예정)

14. Git 관리 주의사항

다음 파일은 Git에 올리지 않습니다.

.env
node_modules
build
.gradle
.idea
.vscode

개인 환경 설정 및 빌드 파일은 .gitignore로 제외합니다.

15. 향후 개발 계획

Spring Boot API 구현

Redis 연동

JWT 인증/인가

모바일 앱 개발

AWS 배포 환경 구축

DB 마이그레이션 도입 (Flyway 또는 Liquibase)

Git 첫 푸시 추천

README까지 작성 완료 후 아래 순서로 진행합니다.

git add .
git status
git commit -m "Initial project setup"
git push origin main
권장 확인

푸시 전 다음 사항을 확인합니다.

init.sql 테이블 생성 테스트 완료

docker compose 실행 확인

pgAdmin 접속 및 DB 확인 완료

README 실행 방법 작성 완료

이 README는 팀원이 처음 저장소를 받아도 바로 실행할 수 있도록 작성된 문서입니다.
