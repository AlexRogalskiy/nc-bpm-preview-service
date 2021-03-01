PKG_CONFIG ?= pkg-config
DEST_DIR ?= /opt/bpm-preview-service

SERVICEDIR_SYSTEMD ?= $(shell $(PKG_CONFIG) systemd --variable=systemdsystemunitdir)
SERVICEDIR_SYSTEMD := ${SERVICEDIR_SYSTEMD}
ifeq (,${SERVICEDIR_SYSTEMD})
$(error "Failed to query $(PKG_CONFIG) for package 'systemd'!")
endif

.PHONY: all install uninstall

all:
	yarn install
	yarn build

install:
	install -d ${DEST_DIR}
	rm -rf ${DEST_DIR}/*
	cp -r ./node_modules ${DEST_DIR}/
	cp -r ./build ${DEST_DIR}/
	cp ./package.json ${DEST_DIR}/
	systemctl stop bpm-preview-service.service || true
	install -Dm644 bpm-preview-service.service ${SERVICEDIR_SYSTEMD}/bpm-preview-service.service
	systemctl daemon-reload
	systemctl enable bpm-preview-service.service
	systemctl start bpm-preview-service.service

uninstall:
	systemctl stop bpm-preview-service.service
	systemctl disable bpm-preview-service.service
	rm ${SERVICEDIR_SYSTEMD}/bpm-preview-service.service
	systemctl daemon-reload
	rm -rf ${DEST_DIR}
