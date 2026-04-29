const UI = {

    renderSidebar() {
        const workspaces = Store.all();
        const activeId = Store.activeId();
        const $sidebar = $('#sidebar');
        $sidebar.empty();

        const $list = $('<div class="ws-list"></div>');
        workspaces.forEach(ws => {
            const isActive = ws.id === activeId;
            const $icon = $('<button></button>')
                .addClass('ws-icon' + (isActive ? ' ws-icon--active' : ''))
                .attr({ 'data-id': ws.id, title: ws.name })
                .css({
                    backgroundColor: ws.color,
                    borderColor: isActive ? ws.color : 'transparent',
                    outline: isActive ? ('3px solid ' + ws.color) : 'none',
                    outlineOffset: '2px'
                })
                .text(Utils.getInitial(ws.name));
            $list.append($icon);
        });

        const $footer = $('<div class="nav-footer"></div>');
        const $addBtn = $('<button id="btn-add-ws"></button>')
            .attr('title', i18next.t('values.addWorkspace'))
            .html('<i class="fas fa-plus"></i>');
        $footer.append($addBtn);

        $sidebar.append($list).append($footer);
    },

    renderTitlebar(workspace) {
        const $right = $('#titlebar-right');
        $right.empty();
        if (workspace) {
            const $icon = $('<span class="tb-ws-icon"></span>')
                .css('backgroundColor', workspace.color)
                .text(Utils.getInitial(workspace.name));
            const $name = $('<span class="tb-ws-name"></span>').text(workspace.name);
            $right.append($icon).append($name);
        }
    },

    renderEmpty() {
        $('#main-content').html(
            '<div class="empty-state">' +
            '<button class="ws-action-btn" id="btn-join-ws">' + i18next.t('values.joinWorkspace') + '</button>' +
            '<button class="ws-action-btn" id="btn-create-ws">' + i18next.t('values.createWorkspace') + '</button>' +
            '</div>'
        );
    },

    renderJoinForm() {
        $('#main-content').html(
            '<div class="join-form">' +
            '<input type="text" id="input-ws-url" class="join-input" placeholder="MyWorkSpace.nizu.io" autocomplete="off" spellcheck="false">' +
            '<button class="ws-primary-btn" id="btn-join-submit">' + i18next.t('values.join') + '</button>' +
            '</div>'
        );
        setTimeout(() => $('#input-ws-url').focus(), 50);
    },

    renderWebview(workspace) {
        $('#main-content').html(
            '<iframe id="ws-webview"' +
            ' src="' + workspace.url + '"' +
            ' allow="fullscreen; camera; microphone; payment; clipboard-read; clipboard-write"' +
            ' referrerpolicy="no-referrer-when-downgrade">' +
            '</iframe>'
        );
    },

    showOnboardingModal() {
        const url = 'https://onboarding.nizu.io/' + Utils.getLangCode() + '?source=app';
        $('#modal-body').html(
            '<div class="onboarding-modal">' +
            '<button class="modal-close-btn" id="btn-modal-close"><i class="fas fa-times"></i></button>' +
            '<iframe src="' + url + '" class="onboarding-iframe"' +
            ' allow="fullscreen; camera; microphone; payment; clipboard-read; clipboard-write"></iframe>' +
            '</div>'
        );
        $('#modal-overlay').removeClass('hidden');
    },

    hideModal() {
        $('#modal-overlay').addClass('hidden');
        $('#modal-body').empty();
    },

    showContextMenu(x, y, workspaceId) {
        this.hideContextMenu();
        const $menu = $('<div class="context-menu" id="context-menu"></div>');

        const items = [
            { action: 'delete', label: i18next.t('values.deleteWorkspace'), danger: true },
            { action: 'refresh', label: i18next.t('values.refreshWindow'), danger: false },
            { action: 'logout', label: i18next.t('values.logout'), danger: false }
        ];

        items.forEach(item => {
            const $btn = $('<button class="ctx-item"></button>')
                .addClass(item.danger ? 'ctx-item--danger' : '')
                .attr({ 'data-action': item.action, 'data-id': workspaceId })
                .text(item.label);
            $menu.append($btn);
        });

        // Keep menu within viewport
        const menuW = 168, menuH = items.length * 38;
        const left = (x + menuW > window.innerWidth) ? x - menuW : x;
        const top  = (y + menuH > window.innerHeight) ? y - menuH : y;
        $menu.css({ top, left });
        $('body').append($menu);
    },

    hideContextMenu() {
        $('#context-menu').remove();
    }
};
