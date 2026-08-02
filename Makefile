# Makefile for compatibility on Unix-like systems and Windows make setups

.PHONY: bootstrap verify clean dev build lint test doctor ai-doctor ai-health ai-providers ai-test

bootstrap:
	@if [ -f "./scripts/bootstrap.sh" ]; then \
		chmod +x ./scripts/bootstrap.sh ./scripts/install.sh ./scripts/verify.sh ./scripts/doctor.sh ./scripts/ai-health.sh ./scripts/clean.sh; \
		./scripts/bootstrap.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1; \
	fi

verify:
	@if [ -f "./scripts/verify.sh" ]; then \
		./scripts/verify.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1; \
	fi

clean:
	@if [ -f "./scripts/clean.sh" ]; then \
		./scripts/clean.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File .\scripts\clean.ps1; \
	fi

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

test:
	npx vitest run

doctor:
	@if [ -f "./scripts/doctor.sh" ]; then \
		./scripts/doctor.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File .\scripts\doctor.ps1; \
	fi

ai-doctor: doctor

ai-health:
	@if [ -f "./scripts/ai-health.sh" ]; then \
		./scripts/ai-health.sh; \
	else \
		powershell -ExecutionPolicy Bypass -File .\scripts\ai-health.ps1; \
	fi

ai-providers: doctor

ai-test:
	npx vitest run src/lib/ai/__tests__/router.test.ts
