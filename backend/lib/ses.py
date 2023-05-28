# from dataclasses import dataclass

# from mypy_boto3_ses import SESClient

# from src.interfaces.email import EmailInterface


# @dataclass
# class EmailService(EmailInterface):
#     client: SESClient

#     def send(self, from_address: str, to_address: str, title: str, body: str) -> None:
#         self.client.send_templated_email()
