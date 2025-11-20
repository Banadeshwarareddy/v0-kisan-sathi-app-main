from django.db import models
from django.conf import settings

class Teacher(models.Model):
    """Model to represent a teacher."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_profile')
    subject = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.subject})"

class Course(models.Model):
    """Model to represent a course."""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Student(models.Model):
    """Model to represent a student."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    date_of_birth = models.DateField()
    address = models.TextField(blank=True)
    guardian_name = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Enrollment(models.Model):
    """Model to link students with courses."""
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateField(auto_now_add=True)
    grade = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        unique_together = ('student', 'course') # A student can only enroll in a course once

    def __str__(self):
        return f"{self.student} enrolled in {self.course}"