from rest_framework import serializers
from .models import Student, Teacher, Course, Enrollment

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.StringRelatedField(source='teacher', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'code', 'teacher', 'teacher_name', 'description')

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.StringRelatedField(source='student', read_only=True)
    course_name = serializers.StringRelatedField(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_name', 'course', 'course_name', 'enrollment_date', 'grade')