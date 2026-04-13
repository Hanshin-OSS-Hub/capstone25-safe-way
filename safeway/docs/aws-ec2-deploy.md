# AWS EC2 배포 가이드

이 프로젝트는 현재 구조상 `EC2 + Docker Compose` 방식이 가장 빠르게 배포할 수 있습니다.

## 1. 추천 배포 구조

- EC2 Ubuntu 서버 1대
- Docker / Docker Compose로 `backend`, `postgres`, `redis` 실행
- 보안 그룹은 `22`, `80` 또는 `8080`만 외부 오픈
- `5432`, `6379`는 외부 오픈 금지

초기 배포는 위 방식이 가장 단순합니다. 이후에는 RDS, ElastiCache, ALB, Route 53으로 분리할 수 있습니다.

## 2. EC2 준비

EC2 인스턴스를 생성한 뒤 SSH로 접속합니다.

```bash
ssh -i <your-key>.pem ubuntu@<EC2_PUBLIC_IP>
```

Docker 설치:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker
```

## 3. 서버에 프로젝트 업로드

방법 1. 서버에서 직접 clone

```bash
git clone <REPOSITORY_URL>
cd safeway
```

방법 2. 로컬에서 압축 후 업로드

```bash
scp -i <your-key>.pem -r ./safeway ubuntu@<EC2_PUBLIC_IP>:~/
```

## 4. 환경변수 파일 생성

`infra/.env.example`을 복사해서 실제 값으로 채웁니다.

```bash
cd ~/safeway/infra
cp .env.example .env
```

수정이 필요한 핵심 값:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_REDIRECT_URI`
- 필요 시 `BACKEND_PORT`

`JWT_SECRET`은 32자 이상 랜덤 문자열로 설정하세요.

## 5. 배포 실행

```bash
cd ~/safeway/infra
docker compose --env-file .env -f docker-compose.prod.yml up -d --build
```

상태 확인:

```bash
docker compose -f docker-compose.prod.yml ps
docker logs safeway-backend --tail 100
```

## 6. 접속 확인

브라우저에서 아래 주소로 확인합니다.

```text
http://<EC2_PUBLIC_IP>:8080
```

만약 80 포트로 열고 싶다면 `.env`에서 `BACKEND_PORT=80`으로 바꾸고, EC2 보안 그룹에서 80 포트를 허용하면 됩니다.

## 7. 보안 그룹 권장값

- `22`: 내 IP만 허용
- `80`: 전체 허용 또는 테스트용으로 필요한 범위만 허용
- `8080`: 80을 쓰지 않을 때만 허용
- `5432`: 허용하지 않음
- `6379`: 허용하지 않음

## 8. 운영 시 권장 다음 단계

- PostgreSQL을 EC2 컨테이너 대신 RDS로 분리
- Redis를 ElastiCache로 분리
- Nginx 또는 ALB 앞단 추가
- HTTPS 적용
- GitHub Actions로 자동 배포 구성

## 9. EC2에 처음 한 번만 할 설정

서버에서 저장소를 내려받고 배포 스크립트 권한을 부여합니다.

```bash
cd ~
git clone <REPOSITORY_URL>
cd ~/safeway
chmod +x infra/deploy.prod.sh
```

실제 환경값 파일을 생성합니다.

```bash
cd ~/safeway/infra
cp .env.example .env
nano .env
```

최소한 아래 값은 실제 운영값으로 바꿔야 합니다.

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_REDIRECT_URI`

## 10. GitHub Actions 자동배포 설정

이 저장소에는 `main` 브랜치에 push되면 EC2에 SSH 접속해서 자동 재배포하는 워크플로우가 포함되어 있습니다.

추가된 파일:

- `.github/workflows/deploy-backend.yml`
- `infra/deploy.prod.sh`

GitHub 저장소 `Settings > Secrets and variables > Actions`에 아래 Secrets를 등록하세요.

- `EC2_HOST`: EC2 퍼블릭 IP 또는 도메인
- `EC2_PORT`: 보통 `22`
- `EC2_USERNAME`: Ubuntu면 보통 `ubuntu`
- `EC2_SSH_KEY`: PEM 개인키 내용 전체
- `EC2_REPO_DIR`: 예시 `~/safeway`

자동배포 동작 순서:

1. GitHub Actions가 EC2에 SSH 접속
2. 서버 저장소를 `origin/main` 기준으로 갱신
3. `infra/deploy.prod.sh` 실행
4. Docker Compose로 백엔드 재빌드 및 재시작

## 11. 보안 체크

- PEM 키는 Git에 올리지 말고 GitHub Secret에만 저장
- EC2 보안 그룹의 `22` 포트는 가능하면 본인 IP만 허용
- `POSTGRES_PASSWORD`, `JWT_SECRET`는 예시값 그대로 쓰지 말 것
- 외부 공개 주소를 쓸 경우 `KAKAO_REDIRECT_URI`도 같은 주소로 맞출 것

## 12. 로컬 테스트 참고

Windows에 별도 PostgreSQL이 설치돼 있으면 기본 포트 `5432` 충돌이 날 수 있습니다.

이 저장소의 로컬 Docker 포트는 다음 값으로 맞춰두는 것을 권장합니다.

- PostgreSQL: `15432`
- Redis: `16379`

로컬 인프라 실행:

```bash
cd infra
docker compose up -d postgres redis
```

테스트는 `backend/src/test/resources/application.properties`가 위 포트를 기준으로 실행됩니다.
