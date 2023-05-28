from django.apps import AppConfig


class APIControllerConfig(AppConfig):
    name = 'app.modules.api_ctrl'
    verbose_name = 'APIController'
    label = 'api_ctrl'

    def ready(self) -> None:
        from app import configurator
        from app.modules import (auth_cmpt, core_cmpt, file_repo, image_repo,
                                 mail_repo, sheet_repo, user_repo)

        configurator.add(
            auth_cmpt.accessors.configure,
            core_cmpt.accessors.configure,
            image_repo.accessors.configure,
            file_repo.accessors.configure,
            mail_repo.accessors.configure,
            user_repo.accessors.configure,
            sheet_repo.accessors.configure,
        )
